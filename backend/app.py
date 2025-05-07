
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import threading
import time
import datetime
import queue
import json
from werkzeug.utils import secure_filename
from ImageScrapper import process_image
from CaseRetagging import process_data as process_case_retagging
from InsightArchiving import process_data as process_insight_archiving
from LogoSlideGenerator import process_companies as process_logo_slide_generator

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials support
app.secret_key = "bain_ppk_toolkit_secret_key"  # For session management

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Task queue for each tool
task_queues = {
    'iris': queue.Queue(),
    'case-retagging': queue.Queue(),
    'insight-archiving': queue.Queue(),
    'logo-slide-generator': queue.Queue()
}

# Task status tracking
task_status = {}  # Format: {task_id: {status, position, result, email}}
task_counter = {tool_type: 0 for tool_type in task_queues.keys()}
currently_processing = {tool_type: False for tool_type in task_queues.keys()}

# Worker threads
workers = {}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_task_queue(tool_type):
    """Background worker to process tasks in the queue"""
    global currently_processing
    
    while True:
        task = task_queues[tool_type].get()
        currently_processing[tool_type] = True
        task_id = task['task_id']
        
        try:
            # Update status to processing
            task_status[task_id]['status'] = 'processing'
            task_status[task_id]['position'] = 0
            
            # Process the task
            if tool_type == 'iris':
                result = process_image(task['filepath'])
            elif tool_type == 'case-retagging':
                result = process_case_retagging(task['filepath'])
            elif tool_type == 'insight-archiving':
                result = process_insight_archiving(task['filepath'])
            elif tool_type == 'logo-slide-generator':
                result = process_logo_slide_generator(task['filepath'])
            else:
                result = {'error': f'Unknown tool type: {tool_type}'}
            
            # Update task with result
            task_status[task_id]['status'] = 'completed'
            task_status[task_id]['result'] = result
            
            # Log completion
            log_message = {
                'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'task_id': task_id,
                'tool_type': tool_type,
                'status': 'completed',
                'email': task_status[task_id]['email']
            }
            log_task(log_message)
            
        except Exception as e:
            # Update task with error
            task_status[task_id]['status'] = 'failed'
            task_status[task_id]['result'] = {'error': str(e)}
            
            # Log error
            log_message = {
                'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'task_id': task_id,
                'tool_type': tool_type,
                'status': 'failed',
                'error': str(e),
                'email': task_status[task_id]['email']
            }
            log_task(log_message)
            
        finally:
            task_queues[tool_type].task_done()
            
            # Update positions of remaining tasks
            for tid, t_status in task_status.items():
                if t_status['tool_type'] == tool_type and t_status['status'] == 'queued':
                    t_status['position'] -= 1
            
            currently_processing[tool_type] = False

def log_task(log_message):
    """Log task information to file"""
    log_dir = 'logs'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    log_file = os.path.join(log_dir, 'task_queue.log')
    with open(log_file, 'a') as f:
        f.write(json.dumps(log_message) + '\n')

# Start worker threads for each tool type
for tool_type in task_queues.keys():
    worker_thread = threading.Thread(
        target=process_task_queue, 
        args=(tool_type,),
        daemon=True
    )
    worker_thread.start()
    workers[tool_type] = worker_thread

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '')
    
    # Validate email format (must be @bain.com)
    if not email.endswith('@bain.com'):
        return jsonify({'error': 'Only Bain.com email addresses are allowed'}), 401
    
    # For a real app, we would validate against a user database
    # For now, we'll just use the email as authentication
    session['email'] = email
    return jsonify({'success': True, 'email': email})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('email', None)
    return jsonify({'success': True})

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    if 'email' in session:
        return jsonify({'authenticated': True, 'email': session['email']})
    return jsonify({'authenticated': False}), 401

@app.route('/api/process', methods=['POST'])
def process_file():
    # Check authentication
    if 'email' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    tool_type = request.form.get('toolType', 'iris')  # Default to iris if not specified
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Create task ID and add to queue
        task_counter[tool_type] += 1
        task_id = f"{tool_type}-{task_counter[tool_type]}"
        
        # Calculate position in queue
        position = task_queues[tool_type].qsize()
        if currently_processing[tool_type]:
            position += 1
        
        # Store task information
        task_status[task_id] = {
            'status': 'queued',
            'position': position,
            'tool_type': tool_type,
            'result': None,
            'email': session['email'],
            'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Add to queue
        task = {
            'task_id': task_id,
            'filepath': filepath,
            'email': session['email']
        }
        task_queues[tool_type].put(task)
        
        # Log submission
        log_message = {
            'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'task_id': task_id,
            'tool_type': tool_type,
            'status': 'queued',
            'position': position,
            'email': session['email']
        }
        log_task(log_message)
        
        return jsonify({
            'message': 'File submitted successfully',
            'task_id': task_id,
            'position': position
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/process-companies', methods=['POST'])
def process_companies():
    # Check authentication
    if 'email' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        company_names = request.form.get('companyNames', '[]')
        tool_type = 'logo-slide-generator'
        
        # Create a temp file with the company names
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        filename = f"companies_{int(time.time())}.json"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        with open(filepath, 'w') as f:
            f.write(company_names)
        
        # Create task ID and add to queue
        task_counter[tool_type] += 1
        task_id = f"{tool_type}-{task_counter[tool_type]}"
        
        # Calculate position in queue
        position = task_queues[tool_type].qsize()
        if currently_processing[tool_type]:
            position += 1
        
        # Store task information
        task_status[task_id] = {
            'status': 'queued',
            'position': position,
            'tool_type': tool_type,
            'result': None,
            'email': session['email'],
            'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Add to queue
        task = {
            'task_id': task_id,
            'filepath': filepath,
            'email': session['email']
        }
        task_queues[tool_type].put(task)
        
        # Log submission
        log_message = {
            'timestamp': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'task_id': task_id,
            'tool_type': tool_type,
            'status': 'queued',
            'position': position,
            'email': session['email']
        }
        log_task(log_message)
        
        return jsonify({
            'message': 'Company names submitted successfully',
            'task_id': task_id,
            'position': position
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/task/<task_id>', methods=['GET'])
def get_task_status(task_id):
    # Check authentication
    if 'email' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if task_id not in task_status:
        return jsonify({'error': 'Task not found'}), 404
    
    # Only allow the user who submitted the task to check its status
    if task_status[task_id]['email'] != session['email']:
        return jsonify({'error': 'Unauthorized access to this task'}), 403
        
    status_data = task_status[task_id]
    return jsonify(status_data)

@app.route('/api/tasks', methods=['GET'])
def get_user_tasks():
    # Check authentication
    if 'email' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    email = session['email']
    user_tasks = {}
    
    for task_id, task_data in task_status.items():
        if task_data['email'] == email:
            user_tasks[task_id] = task_data
    
    return jsonify(user_tasks)

@app.route('/api/health', methods=['GET'])
def health_check():
    queue_sizes = {tool: q.qsize() for tool, q in task_queues.items()}
    return jsonify({
        'status': 'ok',
        'queue_sizes': queue_sizes,
        'active_tasks': [tool for tool, active in currently_processing.items() if active]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)


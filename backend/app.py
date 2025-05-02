
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from ImageScrapper import process_image
from CaseRetagging import process_data as process_case_retagging
from InsightArchiving import process_data as process_insight_archiving
from LogoSlideGenerator import process_data as process_logo_slide_generator

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'csv'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/process', methods=['POST'])
def process_file():
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
        
        # Process the file using the appropriate script based on tool type
        if tool_type == 'iris':
            result = process_image(filepath)
        elif tool_type == 'case-retagging':
            result = process_case_retagging(filepath)
        elif tool_type == 'insight-archiving':
            result = process_insight_archiving(filepath)
        elif tool_type == 'logo-slide-generator':
            result = process_logo_slide_generator(filepath)
        else:
            return jsonify({'error': f'Unknown tool type: {tool_type}'}), 400
        
        return jsonify({'message': 'File processed successfully', 'result': result})
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

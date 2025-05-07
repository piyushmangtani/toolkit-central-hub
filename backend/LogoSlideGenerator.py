
import pandas as pd
import json
import requests
import os
import time
from datetime import datetime

def process_companies(company_names):
    """
    Process company names for Logo Slide Generation.
    
    Args:
        company_names (str): JSON string of company names or path to JSON file.
        
    Returns:
        dict: A dictionary containing the processing result.
    """
    try:
        # Check if company_names is a file path or a JSON string
        if os.path.isfile(company_names):
            with open(company_names, 'r') as file:
                file_content = file.read().strip()
                if not file_content:
                    raise ValueError("Empty file content")
                
                try:
                    data = json.loads(file_content)
                except json.JSONDecodeError:
                    # Try parsing as a raw list if JSON object fails
                    # This is a fallback in case the file doesn't contain valid JSON
                    companies = [name.strip() for name in file_content.replace('[', '').replace(']', '').replace('"', '').split(',') if name.strip()]
                    if not companies:
                        raise ValueError("No valid company names found in file")
                    else:
                        print(f"Parsed {len(companies)} companies from file content")
        else:
            # Assume company_names is a JSON string directly
            data = json.loads(company_names)
        
        # Extract companies from the data
        if isinstance(data, dict):
            companies = data.get('companies', [])
        elif isinstance(data, list):
            companies = data  # If data is already a list, use it directly
        else:
            companies = [str(data)]  # Convert to string if it's a single value
        
        # Validate companies
        if not companies or not isinstance(companies, list):
            return {
                'error': "No valid company names provided",
                'message': "Logo Slide Generation failed: No valid company names found."
            }
            
        print(f"Processing Logo Slide Generator for companies: {companies}")
        
        # Create directory for logos if it doesn't exist
        output_dir = os.path.join('uploads', 'logos', datetime.now().strftime('%Y%m%d_%H%M%S'))
        os.makedirs(output_dir, exist_ok=True)
        
        # API key for the logo API
        api_key = 'wbAz6zLtvo11is956wPNew==PUsDlGTjItHuEs5I'
        
        # Fetch logos for each company
        successful_logos = []
        failed_logos = []
        
        for company in companies:
            try:
                # Skip empty company names
                if not company or not company.strip():
                    continue
                    
                company = company.strip()
                
                # Make API request to get logo
                api_url = f'https://api.api-ninjas.com/v1/logo?name={company}'
                response = requests.get(api_url, headers={'X-Api-Key': api_key})
                
                if response.status_code == 200:
                    logo_data = response.json()
                    if logo_data:
                        # Save the logo information
                        logo_info = {
                            'company': company,
                            'logo_data': logo_data
                        }
                        
                        # Save to the output directory
                        output_file = os.path.join(output_dir, f"{company.replace(' ', '_')}_logo.json")
                        with open(output_file, 'w') as f:
                            json.dump(logo_info, f, indent=2)
                            
                        successful_logos.append({
                            'company': company,
                            'file_path': output_file
                        })
                    else:
                        failed_logos.append({
                            'company': company,
                            'reason': 'No logo data returned from API'
                        })
                else:
                    failed_logos.append({
                        'company': company,
                        'reason': f"API Error: {response.status_code}, {response.text}"
                    })
                
                # Add delay to avoid API rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                failed_logos.append({
                    'company': company,
                    'reason': str(e)
                })
        
        # Generate result information
        result = {
            'message': "Logo Slide Generation completed successfully.",
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_companies': len(companies),
            'successful_logos': successful_logos,
            'failed_logos': failed_logos,
            'output_directory': output_dir
        }
        
        return result
        
    except Exception as e:
        print(f"Error in process_companies: {str(e)}")
        return {
            'error': str(e),
            'message': "Logo Slide Generation failed."
        }

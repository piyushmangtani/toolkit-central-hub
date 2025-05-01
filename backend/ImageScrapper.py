import pandas as pd

def process_image(file_path):
    """
    Process an Excel file and extract data from it as JSON.

    Args:
        file_path (str): Path to the Excel file.

    Returns:
        str: A JSON string (list of records) representing the sheet’s data,
             with any missing values as null.
    """
    print(f"Processing file: {file_path}")
    # Read the first sheet of the Excel file into a DataFrame
    df = pd.read_excel(file_path)

    # Export directly to JSON (orient="records" → list of dicts; NaN → null)
    json_str = df.to_json(orient="records")

    #return json_str
    return {"message": json_str}

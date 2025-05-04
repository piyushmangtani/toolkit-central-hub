def process_data(file_path):
    """
    Returns the numbers 1,2,3,4,5 as a list.
    """
    # simple loop to collect 1→5
    result = []
    for i in range(1, 6):
        result.append(i)
    
    # send back as JSON‐serializable data
    return {"message": result}


# IRIS Image Scrapper Backend

This is a simple Flask server that handles image processing requests from the IRIS Image Scrapper frontend.

## Setup

1. Install Python 3.7+ if you don't have it already.
2. Install dependencies:
```
pip install -r requirements.txt
```

## Running the server
```
python app.py
```

The server will run on http://localhost:5000

## Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/process`: Process an uploaded image file

## How it works

1. The frontend sends an image file to the `/api/process` endpoint.
2. The server saves the file to the uploads directory.
3. The ImageScrapper.py script processes the file.
4. The server returns the processing results as JSON.

import pandas as pd
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def process_data(file_path):
    print(f"Processing file: {file_path}")
    df = pd.read_excel(file_path)
    json_str = df.to_json(orient="records")

    chrome_options = Options()
    # Always run with a visible window; no headless argument added

    # Service will download and manage the correct driver automatically

    num_tabs=3
    pause=1
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Open first tab
    driver.get("https://www.facebook.com")
    time.sleep(pause)
        # Open the remaining tabs
    for _ in range(num_tabs - 1):
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])
        driver.get("https://www.facebook.com")
        time.sleep(pause)

    print(f"Opened {num_tabs} tabs to facebook.com")

    return {"message": json_str}
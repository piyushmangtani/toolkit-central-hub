import os
import requests
from urllib.parse import urlparse, unquote

API_KEY = 'wbAz6zLtvo11is956wPNew==PUsDlGTjItHuEs5I'
API_ENDPOINT = 'https://api.api-ninjas.com/v1/logo'
OUTPUT_DIR = 'logos'

def ensure_dir(path):
    if not os.path.isdir(path):
        os.makedirs(path, exist_ok=True)

def get_extension_from_url(url):
    """
    Infer a file extension from the URL path.
    Falls back to '.png' if none found.
    """
    path = unquote(urlparse(url).path)            # e.g. '/logos/foo.png'
    ext = os.path.splitext(path)[1]               # e.g. '.png'
    return ext if ext else '.png'

def download_image(url, save_path):
    resp = requests.get(url, stream=True, verify=False)
    resp.raise_for_status()
    with open(save_path, 'wb') as f:
        for chunk in resp.iter_content(1024):
            f.write(chunk)

def fetch_and_save_logos(names):
    headers = {'X-Api-Key': API_KEY}
    ensure_dir(OUTPUT_DIR)

    for name in names:
        print(f"\n🔍 Fetching logo info for: {name!r}")
        resp = requests.get(API_ENDPOINT, headers=headers, params={'name': name}, verify=False)
        if resp.status_code != requests.codes.ok:
            print(f"  ⚠️ API error ({resp.status_code}): {resp.text}")
            continue

        results = resp.json()
        if not results:
            print("  ⚠️ No logos found.")
            continue

        for idx, item in enumerate(results):
            img_url = item.get('image')
            if not img_url:
                print(f"  ⚠️ Result #{idx} has no image URL.")
                continue

            ext = get_extension_from_url(img_url)
            # sanitize name for filename
            safe = name.strip().replace(' ', '_').replace('/', '_')
            filename = f"{safe}_{idx}{ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)

            try:
                print(f"  ↓ Downloading image #{idx} from {img_url}")
                download_image(img_url, filepath)
                print(f"  ✅ Saved to {filepath}")
            except Exception as e:
                print(f"  ❌ Failed to download: {e}")

if __name__ == '__main__':
    # Example: extend this list with any company names you like
    names = [
        'Microsoft',
        'Apple',
        'Google',
        # 'Amazon', 'Facebook', ...
    ]
    fetch_and_save_logos(names)

import xml.etree.ElementTree as ET
import urllib.request
import json
import os

class ArticleFetcher:
    def __init__(self, save_dir='./sources'):
        self.save_dir = save_dir
        os.makedirs(self.save_dir, exist_ok=True)

    def fetch_rss_titles(self, rss_url, source):
        try:
            with urllib.request.urlopen(rss_url) as response:
                xml_data = response.read()
        except Exception as e:
            print(f"Error fetching URL {rss_url}: {e}")
            return

        root = ET.fromstring(xml_data)
        items = root.findall('.//item')

        data = []

        for i, item in enumerate(items):
            if i >= 40:
                break

            title = item.find('title').text if item.find('title') is not None else ""
            link = item.find('link').text if item.find('link') is not None else ""
            pubDate = item.find('pubDate').text if item.find('pubDate') is not None else ""

            data.append({
                "title": title,
                "link": link,
                "pubDate": pubDate,
                "source": source
            })

        with open(os.path.join(self.save_dir, f"{source}.json"), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)



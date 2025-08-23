from RSSFetcher import ArticleFetcher
from TopicClustering import HeadlineSorter
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class NewsAggregator():
    def __init__(self):
        self.fetcher = ArticleFetcher()
        self.sorter = HeadlineSorter()
        self.sources = { 
            "twz" : "https://www.twz.com/feed",
            "wot" : "https://warontherocks.libsyn.com/rss",
            "lwj" : "https://www.longwarjournal.org/feed",
            "isw" : "https://www.understandingwar.org/feeds-publications.xml",
        } 

    def fetch_all_feeds(self):
        for name, url in self.sources.items():
            self.fetcher.fetch_rss_titles(url, name)
    
    def load_headlines(self):
        data = []
        for src in self.sources.keys():
            with open(f"./sources/{src}.json", "r", encoding="utf-8") as f:
                for item in json.load(f):
                    data.append({
                        "source": src,
                        "title": item["title"],
                        "link": item["link"],
                        "pubDate": item["pubDate"]
                    })
        return data
    
    def sort_headlines(self):
        self.fetch_all_feeds()
        headlines = self.load_headlines()
        clusters = self.sorter.topic_clustering(headlines)
        return clusters

with app.app_context():
    print("initializing...")
    clusterer = NewsAggregator()

@app.route("/clusters", method=['GET'])
def get_clusters():
    clusters = clusterer.sort_headlines()
    return jsonify(clusters) 

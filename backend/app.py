from RSSFetcher import ArticleFetcher
from TopicClustering import HeadlineSorter
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

NEWS_SOURCES = {
            "bbc": "https://feeds.bbci.co.uk/news/rss.xml",
            "cnn": "http://rss.cnn.com/rss/cnn_topstories.rss",
            "fox": "http://feeds.foxnews.com/foxnews/latest",
            "pbs": "https://www.pbs.org/newshour/feeds/rss/headlines",
            "the-guardian": "https://www.theguardian.com/us/rss"
        }

class NewsAggregator():
    def __init__(self):
        self.fetcher = ArticleFetcher()
        self.sorter = HeadlineSorter()
        self.sources = { 
            "twz" : "https://www.twz.com/feed",
            "wot" : "https://warontherocks.libsyn.com/rss",
            "lwj" : "https://www.longwarjournal.org/feed"
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

@app.route("/clusters")
def get_clusters():
    clusters = clusterer.sort_headlines()
    return jsonify(clusters) 

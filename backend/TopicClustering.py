from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_distances
import spacy
from collections import Counter
import json

class HeadlineSorter:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.nlp = spacy.load("en_core_web_sm")

    def topic_clustering(self, data):
        headlines = [item["title"] for item in data]
        embeddings = self.model.encode(headlines)

        clustering = DBSCAN(eps=0.5, min_samples=2, metric='cosine').fit(embeddings)

        clustered = {}
        for i, label in enumerate(clustering.labels_):
            if label == -1:
                continue
            clustered.setdefault(label, []).append(data[i])

        filtered_clusters = {}
        cluster_summaries = {}

        for cluster_id, group in clustered.items():
            sources = {item["source"] for item in group}
            if len(sources) > 1:
                filtered_clusters[str(cluster_id)] = group

                titles = [item["title"] for item in group]
                entities = []
                for title in titles:
                    doc = self.nlp(title)
                    for ent in doc.ents:
                        entities.append(ent.text.lower())
                if entities:
                    most_common_entity = Counter(entities).most_common(1)[0][0]
                else:
                    most_common_entity = "unknown"

                cluster_summaries[str(cluster_id)] = most_common_entity

        output = {
            "clusters": filtered_clusters,
            "summaries": cluster_summaries
        }

        return output
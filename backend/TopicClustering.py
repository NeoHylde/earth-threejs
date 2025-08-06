from collections import defaultdict, Counter
import spacy
import json

class HeadlineSorter:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def topic_clustering(self, data):
        country_clusters = defaultdict(list)

        for item in data:
            title = item["title"]
            doc = self.nlp(title)

            entities = [ent.text.lower() for ent in doc.ents if ent.label_ in {"GPE", "NORP"}]

            if entities:
                main_entity = Counter(entities).most_common(1)[0][0]
            else:
                main_entity = "unknown"

            country_clusters[main_entity].append(item)

        output = {
            "clusters": country_clusters,
        }

        return output

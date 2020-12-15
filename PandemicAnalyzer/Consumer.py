from kafka import KafkaConsumer, KafkaProducer
import SentimentAnalyzer
from json import loads, dumps

# Initializer
analyser = SentimentAnalyzer.SentimentAnalyzer()

newsConsumer = KafkaConsumer(
    'twitterraw',
     bootstrap_servers=['node-master:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='twitteranalyzers',
     value_deserializer=lambda x: loads(x.decode('utf-8')))

producer = KafkaProducer(bootstrap_servers=['node-master:9092'],
                        value_serializer=lambda x: dumps(x).encode('utf-8'))

for message in newsConsumer:
    value = message.value
    sentiment = analyser.predict(value["text"]);
    value["sentiment"] = sentiment.__dict__
    producer.send('twitteranalyzed', value=value)


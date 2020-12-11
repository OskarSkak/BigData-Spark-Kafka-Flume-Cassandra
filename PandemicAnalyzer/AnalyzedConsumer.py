from kafka import KafkaConsumer, KafkaProducer
import SentimentAnalyzer
from json import loads, dumps

consumer = KafkaConsumer(
    'twitterraw',
     bootstrap_servers=['node-master:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='twitteranalyzed',
     value_deserializer=lambda x: loads(x.decode('utf-8')))

for message in consumer:
    value = message.value
    print(value)

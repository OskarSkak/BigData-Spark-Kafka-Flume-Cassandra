package com.mycompany.app.spark.kafka.consumers;

import com.mycompany.app.MediaKeyWordComparisonManager;
import com.mycompany.app.SentimentAnalysisComparisonManager;
import com.mycompany.app.kafka.producers.NewsMediaCorrelatedEventProducer;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.*;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.KafkaUtils;
import org.apache.spark.streaming.kafka010.LocationStrategies;

/**
 *
 * @author skakk
 */
public class SentimentAnalyzedTwitterDataToNewsConsumer {
    Map<String, Object> kafkaParams = new HashMap<>();
    SparkConf conf;
    JavaStreamingContext ssc;
    
    public static int NEUTRAL_INDICATOR = 0;
    
    public SentimentAnalyzedTwitterDataToNewsConsumer(SparkConf _conf, JavaStreamingContext _ssc){
        this.conf = _conf;
        this.ssc = _ssc;
    }
    
    public void initiate() throws InterruptedException{
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "node-master:9092,node1:19092,node2:29092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "sentimenttonews");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList("twitteranalyzed");
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        
        JavaDStream<String> lines = stream.map(ConsumerRecord::value);
        
        JavaDStream<String> correlatedWithAmericanNews = lines.filter(line -> {
            return MediaKeyWordComparisonManager.isCorrelatedWithCoronaKeywords(line);
        });
        
        JavaDStream<String> clearlyNegativeOrPositiveAndCorrelated = correlatedWithAmericanNews.filter(tweet -> {
            return !(SentimentAnalysisComparisonManager.hasClearlyPositiveOrNegativeSentiment(tweet) == NEUTRAL_INDICATOR);
        });
        
        clearlyNegativeOrPositiveAndCorrelated.foreachRDD(rdd -> {
            rdd.foreachPartition(partitionOfRecords -> {
                NewsMediaCorrelatedEventProducer producer = new NewsMediaCorrelatedEventProducer();
                while(partitionOfRecords.hasNext()){
                    String nextRecord = partitionOfRecords.next();
                    producer.sendNewsCorrelatedEvent(nextRecord);
                }
                producer.close();
            });
        });
    }
}

package com.mycompany.app.spark.kafka.consumers;

import com.mycompany.app.MediaKeyWordComparisonManager;
import com.mycompany.app.SentimentAnalysisComparisonManager;
import com.mycompany.app.kafka.producers.CoronaCorrelatedEventProducer;
import com.mycompany.app.kafka.producers.NewsMediaCorrelatedEventProducer;
import com.mycompany.app.kafka.producers.SentimentAnalysisCorrelatedProducer;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
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
public class TestConsumer {
    
    public static void main(String[] args) throws InterruptedException{
        SparkConf conf = new SparkConf().setAppName("app name").setMaster("local[*]");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(1000));
    
        coronaStream(conf, ssc, "corona");
        //newsStream(conf, ssc, "newscorrelated");
        //analyzedStream(conf, ssc, "sentiment");
        
        ssc.start();
        ssc.awaitTermination();
    }
    
    private static void coronaStream(SparkConf conf, JavaStreamingContext ssc
                                    , String topic){
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "localhost:9092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "test");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList(topic);
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        JavaDStream<String> lines = stream.map(ConsumerRecord::value);
        lines.print();
        lines.foreachRDD(x -> {
            x.collect().stream().forEach(n-> {
                System.out.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                System.out.println("item of list: "+n);
                System.out.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
            });
        });
    }
    
    private static void newsStream(SparkConf conf, JavaStreamingContext ssc
                                    , String topic){
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "localhost:9092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "test");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList(topic);
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        JavaDStream<String> lines = stream.map(ConsumerRecord::value);
        lines.print();
    }
    
    private static void analyzedStream(SparkConf conf, JavaStreamingContext ssc
                                        , String topic){
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "localhost:9092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "test");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList(topic);
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        JavaDStream<String> lines = stream.map(ConsumerRecord::value);
        lines.print();
    }
}

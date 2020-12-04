package com.mycompany.app;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.api.java.JavaPairDStream;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.KafkaUtils;
import org.apache.spark.streaming.kafka010.LocationStrategies;
import scala.Tuple2;

public class App 
{
    public static void main( String[] args ) throws InterruptedException
    {
        SparkConf conf = new SparkConf().setAppName("app name").setMaster("local[*]");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(1000));
        
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "localhost:9092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "twitterraw_input_stream");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList("twitterraw");
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        //stream.mapToPair(record -> new Tuple2<>(record.key(), record.value())).print();
        
        //Map values from kafka events
        JavaDStream<String> lines = stream.map(new Function<ConsumerRecord<String,String>, String>() {
            @Override
            public String call(ConsumerRecord<String, String> kafkaRecord) throws Exception {
                return kafkaRecord.value();
            }
        });
        
        lines.foreachRDD(record ->{
            System.out.println("\n\n\n\n\n\n\n\nFOREACH"+ record.toString() + "\n\n\n\n\n\n\n\n");
        });
        //lines.print();
        
        
        ssc.start();
        ssc.awaitTermination();
        int a = 0;
    }
    
    
}

package com.mycompany.app;
import com.mycompany.app.spark.kafka.consumers.RawTwitterDataToCovidConsumer;
import com.mycompany.app.spark.kafka.consumers.RawTwitterDataToNewsConsumer;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalysisResultConsumer;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class App 
{
    public static void main( String[] args ) throws InterruptedException
    {
        SparkConf conf = new SparkConf().setAppName("app name").setMaster("local[*]");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(1000));
        
        new RawTwitterDataToNewsConsumer(conf, ssc).initiate();
        new SentimentAnalysisResultConsumer(conf, ssc).initiate();
        new RawTwitterDataToCovidConsumer(conf, ssc).initiate();
        
        ssc.start();
        ssc.awaitTermination();
    } 
}

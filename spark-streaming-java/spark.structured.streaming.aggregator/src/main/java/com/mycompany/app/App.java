package com.mycompany.app;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalyzedTwitterDataToCovidConsumer;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalyzedTwitterDataToNewsConsumer;
import com.mycompany.app.spark.kafka.consumers.NewsCorrelatedKeyWordCountConsumer;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class App 
{
    public static void main( String[] args ) throws InterruptedException
    {
        SparkConf conf = new SparkConf().setAppName("analysis service");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.minutes(10));
        ssc.ssc().sc().setLogLevel("WARN");
        
        new NewsCorrelatedKeyWordCountConsumer(conf, ssc).initiate();
        //new SentimentAnalyzedTwitterDataToCovidConsumer(conf, ssc).initiate();
        //new SentimentAnalyzedTwitterDataToNewsConsumer(conf, ssc).initiate();
        //new SentimentAnalyzedTwitterDataToCovidConsumer(conf, ssc).initiate();
        
        ssc.start();
        ssc.awaitTermination();
    } 
}

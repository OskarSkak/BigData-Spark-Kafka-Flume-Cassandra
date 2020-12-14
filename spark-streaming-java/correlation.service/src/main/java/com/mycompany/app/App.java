package com.mycompany.app;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalyzedTwitterDataToCovidConsumer;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalyzedTwitterDataToNewsConsumer;
import com.mycompany.app.spark.kafka.consumers.SentimentAnalysisResultConsumer;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class App 
{
    public static void main( String[] args ) throws InterruptedException
    {
        SparkConf conf = new SparkConf().setAppName("correlation_app").setMaster("spark://localhost:7077");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(5000));
        
        new SentimentAnalyzedTwitterDataToNewsConsumer(conf, ssc).initiate();
        new SentimentAnalyzedTwitterDataToCovidConsumer(conf, ssc).initiate();
        
        ssc.start();
        ssc.awaitTermination();
    } 
}

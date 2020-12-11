package com.mycompany.app;
import com.mycompany.app.spark.kafka.consumers.RawTwitterDataConsumer;
import org.apache.spark.*;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

public class App 
{
    public static void main( String[] args ) throws InterruptedException
    {
        SparkConf conf = new SparkConf().setAppName("app name").setMaster("local[*]");
        JavaStreamingContext ssc = new JavaStreamingContext(conf, new Duration(1000));
        
        new RawTwitterDataConsumer(conf, ssc).initiate();
    } 
}

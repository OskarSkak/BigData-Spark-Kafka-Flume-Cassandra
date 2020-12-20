package com.mycompany.app.spark.kafka.consumers;

import com.mycompany.app.CoronaKeyWordComparisonManager;
import com.mycompany.app.MediaKeyWordComparisonManager;
import com.mycompany.app.SentimentAnalysisComparisonManager;
import com.mycompany.app.kafka.producers.CoronaCorrelatedEventProducer;
import com.mycompany.app.kafka.producers.AnalysisProducer;
import com.mycompany.app.kafka.producers.WordCountProducer;
import java.util.ArrayList;
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
import org.json.JSONObject;

/**
 *
 * @author skakk
 */
public class TestConsumer {
    
    public static void main(String[] args) throws InterruptedException{
        int res = SentimentAnalysisComparisonManager.hasClearlyPositiveOrNegativeSentiment(te);
        int a = 0;
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
    
    static String te = "\"{\"quoted_status\": {\"extended_tweet\": {\"entities\": {\"urls\": [], \"hashtags\": [], \"user_mentions\": [], \"symbols\": []}, \"full_text\": \"Defeat. Dismissed. Denied. That\\u2019s the resounding and unequivocal answer Donald Trump and his craven cronies get from the Supreme Court. But the effort was, and remains, dangerous, dire, and fundamentally undemocratic.\", \"display_text_range\": [0, 217]}, \"in_reply_to_status_id_str\": null, \"in_reply_to_status_id\": null, \"created_at\": \"Fri Dec 11 23:55:42 +0000 2020\", \"in_reply_to_user_id_str\": null, \"source\": \"<a href=\\\"https://mobile.twitter.com\\\" rel=\\\"nofollow\\\">Twitter Web App</a>\", \"retweet_count\": 2908, \"retweeted\": false, \"geo\": null, \"filter_level\": \"low\", \"in_reply_to_screen_name\": null, \"is_quote_status\": false, \"id_str\": \"1337546634327072768\", \"in_reply_to_user_id\": null, \"favorite_count\": 18475, \"id\": 1337546634327072768, \"text\": \"Defeat. Dismissed. Denied. That\\u2019s the resounding and unequivocal answer Donald Trump and his craven cronies get fro\\u2026 https://t.co/8Uschn9vTU\", \"place\": null, \"lang\": \"en\", \"quote_count\": 273, \"favorited\": false, \"coordinates\": null, \"truncated\": true, \"reply_count\": 414, \"entities\": {\"urls\": [{\"display_url\": \"twitter.com/i/web/status/1\\u2026\", \"indices\": [117, 140], \"expanded_url\": \"https://twitter.com/i/web/status/1337546634327072768\", \"url\": \"https://t.co/8Uschn9vTU\"}], \"hashtags\": [], \"user_mentions\": [], \"symbols\": []}, \"contributors\": null, \"user\": {\"utc_offset\": null, \"friends_count\": 680, \"profile_image_url_https\": \"https://pbs.twimg.com/profile_images/649334374278807552/sUX0LOaE_normal.jpg\", \"listed_count\": 7258, \"profile_background_image_url\": \"http://abs.twimg.com/images/themes/theme14/bg.gif\", \"default_profile_image\": false, \"favourites_count\": 7692, \"description\": \"Journalist, storyteller, and lifelong reader. A Texan, by birth and by choice. Author of WHAT UNITES US #WhatUnitesUs. http://algonquin.com/whatunitesus\", \"created_at\": \"Thu Apr 30 16:56:13 +0000 2009\", \"is_translator\": false, \"profile_background_image_url_https\": \"https://abs.twimg.com/images/themes/theme14/bg.gif\", \"protected\": false, \"screen_name\": \"DanRather\", \"id_str\": \"36711022\", \"profile_link_color\": \"ABB8C2\", \"translator_type\": \"none\", \"id\": 36711022, \"geo_enabled\": true, \"profile_background_color\": \"000000\", \"lang\": null, \"profile_sidebar_border_color\": \"000000\", \"profile_text_color\": \"000000\", \"verified\": true, \"profile_image_url\": \"http://pbs.twimg.com/profile_images/649334374278807552/sUX0LOaE_normal.jpg\", \"time_zone\": null, \"url\": null, \"contributors_enabled\": false, \"profile_background_tile\": false, \"profile_banner_url\": \"https://pbs.twimg.com/profile_banners/36711022/1446650131\", \"statuses_count\": 17975, \"follow_request_sent\": null, \"followers_count\": 1738183, \"profile_use_background_image\": false, \"default_profile\": false, \"following\": null, \"name\": \"Dan Rather\", \"location\": \"New York, NY\", \"profile_sidebar_fill_color\": \"000000\", \"notifications\": null}}, \"in_reply_to_status_id_str\": null, \"in_reply_to_status_id\": null, \"created_at\": \"Sat Dec 12 00:30:54 +0000 2020\", \"in_reply_to_user_id_str\": null, \"source\": \"<a href=\\\"http://twitter.com/#!/download/ipad\\\" rel=\\\"nofollow\\\">Twitter for iPad</a>\", \"quoted_status_id\": 1337546634327072768, \"retweet_count\": 0, \"retweeted\": false, \"geo\": null, \"filter_level\": \"low\", \"in_reply_to_screen_name\": null, \"is_quote_status\": true, \"id_str\": \"1337555490918846467\", \"in_reply_to_user_id\": null, \"favorite_count\": 0, \"id\": 1337555490918846467, \"text\": \"?\", \"place\": {\"country_code\": \"US\", \"country\": \"United States\", \"full_name\": \"Florida, USA\", \"bounding_box\": {\"coordinates\": [[[-87.634643, 24.396308], [-87.634643, 31.001056], [-79.974307, 31.001056], [-79.974307, 24.396308]]], \"type\": \"Polygon\"}, \"place_type\": \"admin\", \"name\": \"Florida\", \"attributes\": {}, \"id\": \"4ec01c9dbc693497\", \"url\": \"https://api.twitter.com/1.1/geo/id/4ec01c9dbc693497.json\"}, \"quoted_status_permalink\": {\"expanded\": \"https://twitter.com/danrather/status/1337546634327072768\", \"display\": \"twitter.com/danrather/stat\\u2026\", \"url\": \"https://t.co/I26zWit3aY\"}, \"lang\": \"und\", \"quote_count\": 0, \"favorited\": false, \"coordinates\": null, \"truncated\": false, \"timestamp_ms\": \"1607733054271\", \"reply_count\": 0, \"entities\": {\"urls\": [], \"hashtags\": [], \"user_mentions\": [], \"symbols\": []}, \"quoted_status_id_str\": \"1337546634327072768\", \"contributors\": null, \"user\": {\"utc_offset\": null, \"friends_count\": 836, \"profile_image_url_https\": \"https://pbs.twimg.com/profile_images/847618107451482114/yG3uro5p_normal.jpg\", \"listed_count\": 3, \"profile_background_image_url\": \"http://abs.twimg.com/images/themes/theme1/bg.png\", \"default_profile_image\": false, \"favourites_count\": 8236, \"description\": \"CPLC, ARCHY Gabriella, Co-Marketplace Director for ASPIRE, JPEF parent advocate, connector of people,\", \"created_at\": \"Sat May 07 08:55:23 +0000 2011\", \"is_translator\": false, \"profile_background_image_url_https\": \"https://abs.twimg.com/images/themes/theme1/bg.png\", \"protected\": false, \"screen_name\": \"Latoyaltw\", \"id_str\": \"294516773\", \"profile_link_color\": \"1DA1F2\", \"translator_type\": \"none\", \"id\": 294516773, \"geo_enabled\": true, \"profile_background_color\": \"C0DEED\", \"lang\": null, \"profile_sidebar_border_color\": \"C0DEED\", \"profile_text_color\": \"333333\", \"verified\": false, \"profile_image_url\": \"http://pbs.twimg.com/profile_images/847618107451482114/yG3uro5p_normal.jpg\", \"time_zone\": null, \"url\": null, \"contributors_enabled\": false, \"profile_background_tile\": false, \"profile_banner_url\": \"https://pbs.twimg.com/profile_banners/294516773/1573692410\", \"statuses_count\": 3041, \"follow_request_sent\": null, \"followers_count\": 303, \"profile_use_background_image\": true, \"default_profile\": true, \"following\": null, \"name\": \"Latoya Taylor-White\", \"location\": \"jacksonville\", \"profile_sidebar_fill_color\": \"DDEEF6\", \"notifications\": null}, \"sentiment\": {\"tweet\": \"?\", \"prediction\": \"Negative\", \"positiveConfidence\": 0.6441422653906584, \"negativeConfidence\": 0.3658577346093415}}\"";
}

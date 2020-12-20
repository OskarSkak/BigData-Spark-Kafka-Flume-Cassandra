package com.mycompany.app.spark.kafka.consumers;

import com.mycompany.app.MediaKeyWordComparisonManager;
import com.mycompany.app.SentimentAnalysisComparisonManager;
import com.mycompany.app.kafka.producers.AnalysisProducer;
import com.mycompany.app.kafka.producers.JavaRecord;
import com.mycompany.app.kafka.producers.WordCountProducer;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.spark.*;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaInputDStream;
import org.apache.spark.streaming.kafka010.ConsumerStrategies;
import org.apache.spark.streaming.kafka010.KafkaUtils;
import org.apache.spark.streaming.kafka010.LocationStrategies;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.StorageLevels;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import java.util.regex.Pattern;
import static javax.ws.rs.client.Entity.json;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.Dataset;

public final class NewsCorrelatedKeyWordCountConsumer {
    Map<String, Object> kafkaParams = new HashMap<>();
    SparkConf conf;
    JavaStreamingContext ssc;
    static final String TIMESPAN = "1 minute";
    private static final Pattern SPACE = Pattern.compile(" ");
    
    public NewsCorrelatedKeyWordCountConsumer(SparkConf _conf, JavaStreamingContext _ssc){
        this.conf = _conf;
        this.ssc = _ssc;
    }
    
    public void initiate() throws InterruptedException{
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put("bootstrap.servers", "node-master:9092,node1:19092,node2:29092");
        kafkaParams.put("key.deserializer", StringDeserializer.class);
        kafkaParams.put("value.deserializer", StringDeserializer.class);
        kafkaParams.put("group.id", "wordcountnews");
        kafkaParams.put("auto.offset.reset", "latest");
        kafkaParams.put("enable.auto.commit", false);
        
        Collection<String> topics = Arrays.asList("twitterraw");
        
        JavaInputDStream<ConsumerRecord<String, String>> stream = 
                KafkaUtils.createDirectStream(
                        ssc, 
                        LocationStrategies.PreferConsistent(), 
                        ConsumerStrategies.<String, String>Subscribe(topics, kafkaParams)
                );
        
        
        JavaDStream<String> lines = stream.map(ConsumerRecord::value);
        
        AtomicReference<Long> tweetsInBatch = new AtomicReference<>();
        lines.foreachRDD(rdd -> tweetsInBatch.set(rdd.count()) );
        
        JavaDStream<String> words = lines.flatMap(x -> Arrays.asList(SPACE.split(x)).iterator());
        
        words.foreachRDD((rdd, time) -> {
            SparkSession spark = JavaSparkSessionSingleton.getInstance(conf);
            JavaRDD<JavaRecord> rowRDD = rdd.map(word -> {
                JavaRecord record = new JavaRecord();
                record.setWord(word);
                return record;
            });
            
            AnalysisProducer producer = new AnalysisProducer();
            
            Dataset<Row> wordsDFrame = spark.createDataFrame(rowRDD, JavaRecord.class);
            wordsDFrame.createOrReplaceTempView("words");
            
            String query = "select upper(word), count(*)"
                            + " as total"
                            + " from words"
                            + " where ";
            
            for(int i = 0; i < MediaKeyWordComparisonManager.getKeywords().size(); i++)
                if(i < MediaKeyWordComparisonManager.getKeywords().size() - 1)  query += "upper(word)=\'"+MediaKeyWordComparisonManager.getKeywords().get(i).toUpperCase()+"\' or ";
                else    query += "upper(word)=\'"+MediaKeyWordComparisonManager.getKeywords().get(i).toUpperCase()+"\'";
                    
            query += " group by upper(word)";
            
            Dataset<Row> wordsCountsDataFrame = spark.sql(query);
            wordsCountsDataFrame.show();
            
            List<Row> collected = wordsCountsDataFrame.collectAsList();
            
            String res = "NEWS CORRELATION BATCH ANALYSIS\n";
            
            for(int i = 0; i < collected.size(); i++)
                       res += "Rank: " + i+1 + " - " + collected.get(i).getAs("upper(word)") + "\n";
            
            res += 
                        "\nTweets Analyzed: \t\t\t" + tweetsInBatch + 
                        "\nPercentage correlated with news: \t\t\t" + (double)collected.size()/(double)tweetsInBatch.get() + 
                        "\nTotal correlated words found: \t\t\t" + collected.size() + 
                        "\nTimspan of analyzed batch: \t\t\t" + TIMESPAN;
            
            System.out.println("*****************\n" + res + "\n**********************");
            producer.sendAnalysisEvent(res);
            producer.close();
        });
        /*
        lines.foreachRDD((rdd ) -> {
            SparkSession spark = JavaSparkSessionSingleton.getInstance(conf);
            
            JavaRDD<JavaRecord> rowRDD = rdd.map(word -> {
                JavaRecord record = new JavaRecord();
                record.setWord(word);
                return record;
            });
            
            Dataset<Row> linesDFrame = spark.createDataFrame(rowRDD, JavaRecord.class);
            
            linesDFrame.createOrReplaceTempView("lines");
            
            String query = "select word, count(*)"
                            + " as total"
                            + " from lines"
                            + " where ";
            
            for(int i = 0; i < MediaKeyWordComparisonManager.getKeywords().size(); i++)
                if(i < MediaKeyWordComparisonManager.getKeywords().size() - 1)  query += "word like \'%"+MediaKeyWordComparisonManager.getKeywords().get(i)+"%\' or ";
                else    query += "word like \'%"+MediaKeyWordComparisonManager.getKeywords().get(i)+"%\'";
                    
            query += " group by word";
            
            Dataset<Row> linesCorrelatedDataFrame = spark.sql(query);
            linesCorrelatedDataFrame.show();
        }); */
    }
}

class JavaSparkSessionSingleton{
            private static transient SparkSession instance = null;
            
            public static SparkSession getInstance(SparkConf conf){
                if (instance == null) {
                    instance = SparkSession
                      .builder()
                      .config(conf)
                      .getOrCreate();
                  }
                return instance; 
            }
        }

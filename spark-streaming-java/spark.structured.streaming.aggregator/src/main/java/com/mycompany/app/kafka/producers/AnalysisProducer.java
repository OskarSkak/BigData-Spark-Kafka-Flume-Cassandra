package com.mycompany.app.kafka.producers;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

/**
 *
 * @author skakk
 */
public class AnalysisProducer {
    String topicName = "sqlanalysis";
    Properties kafkaParams = new Properties();
    Producer<String, String> producer;
    
    public AnalysisProducer(){
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "node-master:9092,node1:19092,node2:29092");
        kafkaParams.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        kafkaParams.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        kafkaParams.put("enable.auto.commit", true);
        
        producer = new KafkaProducer<>(kafkaParams);
    }
    
    public void sendAnalysisEvent(String val){
        this.producer.send(new ProducerRecord<>(this.topicName, val));
    }
    
    public void close(){
        this.producer.close();
    }
}

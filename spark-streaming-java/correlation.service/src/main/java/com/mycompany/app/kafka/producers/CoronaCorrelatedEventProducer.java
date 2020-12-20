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
public class CoronaCorrelatedEventProducer {
    String topicName = "corona";
    Properties kafkaParams = new Properties();
    Producer<String, String> producer;
    static final String BOOTSTRAP_SERVERS = "node-master:9092,node1:19092,node2:29092", 
            GROUP_ID = "group.id", PANDEMIC_GROUP = "pandemic.group.corona", AUTO_OFFSET_RESET = "auto.offset.reset", LATEST = "latest", 
            ENABLE_AUTO_COMMIT = "enable.auto.commit";
    
    public CoronaCorrelatedEventProducer(){
        Map<String, Object> kafkaParams = new HashMap<>();
        kafkaParams.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        kafkaParams.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        kafkaParams.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        kafkaParams.put(GROUP_ID, PANDEMIC_GROUP);
        kafkaParams.put(AUTO_OFFSET_RESET, LATEST);
        kafkaParams.put(ENABLE_AUTO_COMMIT, false);
        producer = new KafkaProducer<>(kafkaParams);
    }
    
    public void sendCoronaCorrelatedEvent(String val){
        this.producer.send(new ProducerRecord<>(this.topicName, val));
    }
    
    public void close(){
        this.producer.close();
    }
}

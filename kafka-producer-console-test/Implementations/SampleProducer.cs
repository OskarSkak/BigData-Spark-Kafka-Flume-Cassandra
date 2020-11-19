using Confluent.Kafka;
using kafka_producer_console_test.Contracts;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace kafka_producer_console_test.Implementations
{
    public class SampleProducer : IProducer
    {
        ProducerConfig producerConfig = new ProducerConfig
        {
            BootstrapServers = "localhost:9092"
        };

        /// <summary>
        /// Without any serializers!!
        /// Has delay > 3ms - not for !stream processing! (given ProduceAsync use)
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task<string> PublishAsync(string topic, string message)
        {
            using (var p = new ProducerBuilder<string, string>(producerConfig).Build())
            {
                try
                {
                    var messg = new Message<string, string> { Key = null, Value = message };
                    DeliveryResult<string, string> a = await p.ProduceAsync(topic, messg);
                    return a.Key;
                }
                catch (ProduceException<string, string> ex)
                {
                    Console.WriteLine($"Delivery failed: {ex.Error.Reason}");
                }
            }
            return null;
        }

        /// <summary>
        /// For stream processing (note not async) - circumvents 3ms delay between messages
        /// for processing big n event collections
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="messages"></param>
        public void PublishStreamAsync(string topic, Dictionary<string, string> messages)
        {
            Action<DeliveryReport<string, string>> handler = r =>
            Console.WriteLine(!r.Error.IsError
                ? $"Delivered message to {r.TopicPartitionOffset}"
                : $"Delivery Error: {r.Error.Reason}");

            using (var p = new ProducerBuilder<string, string>(producerConfig).Build())
            {
                try
                {
                    foreach (var item in messages)
                    {
                        p.Produce(
                            topic,
                            new Message<string, string> { Key = item.Key, Value = item.Value },
                            handler);
                    };
                }
                catch (ProduceException<string, string> ex)
                {
                    Console.WriteLine($"Delivery failed: {ex.Error.Reason}");
                }

                //Give 10 secs for inflight mess to be delivered along with rest
                p.Flush(TimeSpan.FromSeconds(10));
            }

        }
    }
}

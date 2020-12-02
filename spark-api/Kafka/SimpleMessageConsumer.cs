using Confluent.Kafka;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace spark_api.Kafka
{
    public class SimpleMessageConsumer
    {
        ConsumerConfig consumerConfig = new ConsumerConfig
        {
            GroupId = "twitterraw",
            BootstrapServers = "localhost:9092"
        };

        public Task SubscribeAsync(string topic, Action<string> message)
        {
            using (var cons = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                cons.Subscribe(topic);
                var cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) =>
                {
                    e.Cancel = true;
                    cts.Cancel();
                };

                try
                {
                    while (true)
                        try
                        {
                            var cr = cons.Consume(cts.Token);
                            message(cr.Message.Value);
                        }
                        catch (ConsumeException e)
                        {
                            Console.WriteLine(e);
                        }
                }
                catch (Exception)
                {
                    cons.Close();
                }
            }

            return Task.CompletedTask;
        }
    }
}


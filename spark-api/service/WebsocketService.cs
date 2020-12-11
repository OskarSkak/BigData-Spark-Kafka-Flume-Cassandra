using System;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;

namespace spark_api.service
{
    public class WebsocketService : Hub, IHostedService 
    {
        public Task StartAsync(CancellationToken cancellationToken)
        {
            InitKafkaConsumer();
            return Task.CompletedTask;
        }

        public async Task InitKafkaConsumer()
        {
            while (true)
            {
                await Task.Delay(1000);
                Console.WriteLine("Working");
                await Clients.All.SendAsync("twitterraw" , "hej");
            }
            
            /*var conf = new ConsumerConfig
            { 
                GroupId = "test-consumer-group",
                BootstrapServers = "localhost:9092",
               
                // Note: The AutoOffsetReset property determines the start offset in the event
                // there are not yet any committed offsets for the consumer group for the
                // topic/partitions of interest. By default, offsets are committed
                // automatically, so in this example, consumption will only start from the
                // earliest message in the topic 'my-topic' the first time you run the program.
                AutoOffsetReset = AutoOffsetReset.Latest,
               
            };

            using (var c = new ConsumerBuilder<Ignore, string>(conf).Build())
            {
                c.Subscribe("twitterraw");

                CancellationTokenSource cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) => {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };

                try
                {
                    while (true)
                    {
                        try
                        {
                            var cr = c.Consume(cts.Token);
                            //Console.WriteLine($"Consumed message '{cr.Value}' at: '{cr.TopicPartitionOffset}'.");
                        }
                        catch (ConsumeException e)
                        {
                            Console.WriteLine($"Error occured: {e.Error.Reason}");
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    // Ensure the consumer leaves the group cleanly and final offsets are committed.
                    c.Close();
                }
            }*/
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new System.NotImplementedException();
        }
    }
}
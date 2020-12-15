using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using spark_api.hub;
using spark_api.models;

namespace spark_api.service
{
    public class WebsocketService : Hub, IHostedService 
    {
        private readonly IHubContext<SignalRHub> _hub;
        private readonly ICassandraService _cassandraService;

        public WebsocketService(IHubContext<SignalRHub> hub , ICassandraService cassandraService)
        {
            _hub = hub;
            _cassandraService = cassandraService;
        }
        
        public  Task StartAsync(CancellationToken cancellationToken)
        {
            
            SubscribeCoronaStream();
            SubscribeNewsCorrelatedStream();
            //_cassandraService.CleanUp();
            return Task.CompletedTask;
        }
        
        public async Task SubscribeNewsCorrelatedStream()
        {
            var conf = new ConsumerConfig
            { 
                GroupId = "test-consumer-group",
                BootstrapServers = "node-master:9092,node1:19092,node2:29092",
               
                // Note: The AutoOffsetReset property determines the start offset in the event
                // there are not yet any committed offsets for the consumer group for the
                // topic/partitions of interest. By default, offsets are committed
                // automatically, so in this example, consumption will only start from the
                // earliest message in the topic 'my-topic' the first time you run the program.
                AutoOffsetReset = AutoOffsetReset.Latest
            };

            using (var c = new ConsumerBuilder<Ignore, string>(conf).Build())
            {
                c.Subscribe("newscorrelated");

                CancellationTokenSource cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) => {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };
                try
                {
                    while (true)
                    {
                        await Task.Delay(100);
                        try
                        { 
                            var cr = c.Consume(cts.Token);
                            await _hub.Clients.All.SendAsync("newscorrelated", cr.Message);
                            twitteranalyzed tweet = parseToObject(cr.Message.Value);
                            _cassandraService.AddNewscorrelated(tweet);
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
            }
        }

        public async Task SubscribeCoronaStream()
        {
            var conf = new ConsumerConfig
            {
                GroupId = "test-consumer-group",
                BootstrapServers = "nodemaster:9092,node1:19092,node2:29092",

                // Note: The AutoOffsetReset property determines the start offset in the event
                // there are not yet any committed offsets for the consumer group for the
                // topic/partitions of interest. By default, offsets are committed
                // automatically, so in this example, consumption will only start from the
                // earliest message in the topic 'my-topic' the first time you run the program.
                AutoOffsetReset = AutoOffsetReset.Latest
            };

            using (var c = new ConsumerBuilder<Ignore, string>(conf).Build())
            {
               // c.Assign(new TopicPartitionOffset("twitterraw", 0, new Offset(30155)));
                c.Subscribe("corona");
                CancellationTokenSource cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) => {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };
                try
                { while (true) { 
                        await Task.Delay(100);
                        try
                        { 
                            var cr = c.Consume(cts.Token);
                            await _hub.Clients.All.SendAsync("corona", cr.Message);
                            twitteranalyzed tweet = parseToObject(cr.Message.Value);
                            _cassandraService.AddCorona(tweet);
                        }
                        catch (ArgumentOutOfRangeException e)
                        {
                            Console.WriteLine($"Error occured: {e}");
                        }
                        
                    }
                }
                catch (OperationCanceledException)
                {
                    // Ensure the consumer leaves the group cleanly and final offsets are committed.
                    c.Close();
                    _cassandraService.CleanUp();
                }
            }
            _cassandraService.CleanUp();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("Stopping");
            return Task.CompletedTask;
        }

        public twitteranalyzed parseToObject(string value)
        
        {
            var parsedObject = JObject.Parse(value);
            var id = parsedObject["id"].ToString();
            var timestampString = parsedObject["created_at"].ToString();
            var created_at = DateTime.ParseExact(timestampString , "ddd MMM dd HH:mm:ss +0000 yyyy" , CultureInfo.InvariantCulture );
            var text = parsedObject["text"].ToString();
            var screenName = parsedObject["user"]["screen_name"].ToString();
            var tweet = parsedObject["sentiment"]["tweet"].ToString();
            var prediction = parsedObject["sentiment"]["prediction"].ToString();
            var positiveConfidenceString = parsedObject["sentiment"]["positiveConfidence"].ToString();
            var positiveConfidence = Double.Parse(positiveConfidenceString);
            var negativeConfidenceString = parsedObject["sentiment"]["negativeConfidence"].ToString();
            var negativeConfidence = Double.Parse(negativeConfidenceString);
            var coordinates = parsedObject["place"]["bounding_box"]["coordinates"].ToObject<List<List<List<Double>>>>();
            
            twitteranalyzed twitteranalyzed = new twitteranalyzed();
            twitteranalyzed.longitude = (coordinates[0][0][0] + coordinates[0][2][0]) / 2;
            twitteranalyzed.latitude = (coordinates[0][0][1] + coordinates[0][1][1]) / 2;
            twitteranalyzed.created_at = created_at;
            twitteranalyzed.id = id;
            twitteranalyzed.prediction = prediction;
            twitteranalyzed.screen_name = screenName;
            twitteranalyzed.tweet = tweet;
            twitteranalyzed.negativeConfidence = negativeConfidence;
            twitteranalyzed.positiveConfidence = positiveConfidence;
            return twitteranalyzed;

        }
    }
}

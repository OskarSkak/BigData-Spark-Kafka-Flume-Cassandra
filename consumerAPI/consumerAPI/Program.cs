using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Kafka.Public;
using Kafka.Public.Loggers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace consumerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, collection) =>
                {
                    collection.AddHostedService<KafkaConsumerService>();
                });
    }

    public class KafkaConsumerService : IHostedService
    {
        private ClusterClient _cluster;
        private readonly ILogger<KafkaConsumerService> _logger;

        public KafkaConsumerService(ILogger<KafkaConsumerService> logger)
        {
            _logger = logger;
            _cluster = new ClusterClient(new Configuration
            {
                Seeds = "localhost:9092"
            }, new ConsoleLogger()); 
            
        }


        public Task StartAsync(CancellationToken cancellationToken)
        {
            _cluster.ConsumeFromLatest("twitterraw");
            _cluster.MessageReceived += record =>
            {
                _logger.LogInformation($"Recevid: {Encoding.UTF8.GetString(record.Value as byte[])}");
            };
            return Task.CompletedTask;
        }

    

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}

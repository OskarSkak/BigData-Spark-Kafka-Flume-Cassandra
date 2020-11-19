using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace spark_api.Kafka
{
    public class KafkaManager
    {
        private BackgroundWorker worker;
        private string topic;
        public void InitiateSubscription(string topic)
        {
            worker = new BackgroundWorker();
            this.topic = topic;
        }

        private async void worker_Subscribe(object sender, ElapsedEventArgs e)
        {
            var consumer = new SimpleMessageConsumer();
            await consumer.SubscribeAsync(topic, Console.WriteLine);
        }

    }
}

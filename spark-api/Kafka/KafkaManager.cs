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
            this.topic = topic;
            worker = new BackgroundWorker();
            worker.DoWork += worker_DoWork;
            worker.RunWorkerAsync();
        }

        private void worker_DoWork(object sender, DoWorkEventArgs e)
        {
            var consumer = new SimpleMessageConsumer();
            consumer.SubscribeAsync(topic, Console.WriteLine);
        }

    }
}

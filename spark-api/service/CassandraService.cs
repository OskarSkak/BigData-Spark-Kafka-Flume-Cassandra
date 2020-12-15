using System;
using System.Threading;
using System.Threading.Tasks;
using Cassandra;
using Microsoft.Extensions.Hosting;

namespace spark_api.service
{
    public class CassandraService : IHostedService
    {
        public Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("Hello Cassandra!");
 
            var cluster = Cluster.Builder()
                .AddContactPoints( "node-master")
                .WithPort(9042)
                .WithAuthProvider(new PlainTextAuthProvider("cassandra" , "cassandra"))
                .Build();
 
            // Connect to the nodes using a keyspace
            var session = cluster.Connect("pandemic");
 
            // Get name of a Cluster
            Console.WriteLine("The cluster's name is: " + cluster.Metadata.ClusterName);
            
            

            var rs = session.Execute("SELECT * from testtable ");

            // Execute a query on a connection synchronously

            foreach (var row in rs)
            {
                Console.WriteLine(row[0] + " " + row[1] + " " + row[2]);
            }

            Console.WriteLine(rs);
            
            return  Task.CompletedTask;

        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new System.NotImplementedException();
        }
    }
}
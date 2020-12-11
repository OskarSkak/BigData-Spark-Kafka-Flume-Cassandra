using Microsoft.Spark.Sql;
using System;

namespace kafka_producer_console_test
{
    class Program
    {
        static void Main(string[] args)
        {
            var hostname = "spark";
            var port = 5050;

            SparkSession spark = SparkSession
                .Builder()
                .AppName("Streaming example with dotnet")
                .GetOrCreate();


            DataFrame lines = spark
                .ReadStream()
                .Format("socket")
                .Option("host", hostname)
                .Option("port", port)
                .Load();
        }
    }
}

using System;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

namespace sparkstreamingconsole
{
    class Program
    {
        static void Main(string[] args)
        {
            SparkSession spark = SparkSession
                .Builder()
                .AppName("Test example")
                .GetOrCreate();

            DataFrame lines = spark
                .ReadStream()
                .Format("kafka")
                .Option("kafka.bootstrap.servers", "localhost:9092")
                .Option("subscribe", "twitterraw")
                .Load()
                .SelectExpr("CAST(value AS STRING)");

            lines.PrintSchema();
        }
    }
}

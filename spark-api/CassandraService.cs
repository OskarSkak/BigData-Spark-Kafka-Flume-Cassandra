using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cassandra;
using spark_api.models;

namespace spark_api
{
    public interface ICassandraService
    {
        void AddNewscorrelated(twitteranalyzed tweet);
        void AddCorona(twitteranalyzed tweet);
        void CleanUp();
        Task<List<twitteranalyzed>> GetAllNews();
        Task<List<twitteranalyzed>> GetAllCorona();
        Task<List<twitteranalyzed>> GetAllBetweenNews(int from, int to , int size);
        Task<List<twitteranalyzed>> GetAllBetweenCorona(int from, int to ,int size);
    }
    public class CassandraService : ICassandraService
    {
        private Cluster _cluster;
        private ISession _session;
        public CassandraService()
        {
            var cluster = Cluster.Builder()
                .AddContactPoints( "node-master")
                .WithPort(9042)
                .WithAuthProvider(new PlainTextAuthProvider("cassandra" , "cassandra"))
                .Build();
            _cluster = cluster;
            _session = _cluster.Connect("pandemic");
        }


        public void AddNewscorrelated(twitteranalyzed tweet)
        {
            //string query = " INSERT INTO tweet(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet ) VALUES ('" + tweet.id + "'," + tweet.created_at.Second + "," + tweet.negativeConfidence + "," + tweet.positiveConfidence + ",'" + tweet.prediction + "','" + tweet.screen_name + "','" + tweet.tweet + "'"+ ")";
            
            var ps = _session.Prepare(" INSERT INTO covid(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet , latitude , longitude , typeof) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?)");

// ...bind different parameters every time you need to execute
            var statement = ps.Bind(tweet.id , tweet.created_at , tweet.negativeConfidence , tweet.positiveConfidence , tweet.prediction , tweet.screen_name , tweet.tweet , tweet.latitude , tweet.longitude , "news");
// Execute the bound statement with the provided parameters
           
            
            
            _session.Execute(statement);
            
            
        }
        
        public void AddCorona(twitteranalyzed tweet)
        {
            //string query = " INSERT INTO tweet(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet ) VALUES ('" + tweet.id + "'," + tweet.created_at.Second + "," + tweet.negativeConfidence + "," + tweet.positiveConfidence + ",'" + tweet.prediction + "','" + tweet.screen_name + "','" + tweet.tweet + "'"+ ")";
            
            var ps = _session.Prepare(" INSERT INTO covid(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet , latitude , longitude, typeof) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?)");

           // ...bind different parameters every time you need to execute
            var statement = ps.Bind(tweet.id , tweet.created_at , tweet.negativeConfidence , tweet.positiveConfidence , tweet.prediction , tweet.screen_name , tweet.tweet , tweet.latitude , tweet.longitude, "corona");
        // Execute the bound statement with the provided parameters
           
            
            
            _session.Execute(statement);
            
            
        }

        public async Task<List<twitteranalyzed>> GetAllNews()
        {
            List<twitteranalyzed> historicTweets = new List<twitteranalyzed>();

           
            var rs = await _session.ExecuteAsync(new SimpleStatement("Select * from news"));
            foreach (var row in rs)
            {
                twitteranalyzed hisTweet = new twitteranalyzed();
                hisTweet.id = row.GetValue<string>("id");
                hisTweet.created_at = row.GetValue<DateTime>("created_at");
                hisTweet.latitude = row.GetValue<Double>("latitude");
                hisTweet.longitude = row.GetValue<Double>("longitude");
                hisTweet.negativeConfidence = row.GetValue<Double>("negativeconfidence");
                hisTweet.positiveConfidence = row.GetValue<Double>("positiveconfidence");
                hisTweet.prediction = row.GetValue<string>("prediction");
                hisTweet.screen_name = row.GetValue<string>("screen_name");
                hisTweet.tweet = row.GetValue<string>("tweet");

                historicTweets.Add(hisTweet);

           
            }
           

            return historicTweets;
        }

        public async Task<List<twitteranalyzed>> GetAllCorona()
        {
           List<twitteranalyzed> historicTweets = new List<twitteranalyzed>();

           
           var rs = await _session.ExecuteAsync(new SimpleStatement("Select * from tweet"));
           foreach (var row in rs)
           {
               twitteranalyzed hisTweet = new twitteranalyzed();
               hisTweet.id = row.GetValue<string>("id");
               hisTweet.created_at = row.GetValue<DateTime>("created_at");
               hisTweet.latitude = row.GetValue<Double>("latitude");
               hisTweet.longitude = row.GetValue<Double>("longitude");
               hisTweet.negativeConfidence = row.GetValue<Double>("negativeconfidence");
               hisTweet.positiveConfidence = row.GetValue<Double>("positiveconfidence");
               hisTweet.prediction = row.GetValue<string>("prediction");
               hisTweet.screen_name = row.GetValue<string>("screen_name");
               hisTweet.tweet = row.GetValue<string>("tweet");

               historicTweets.Add(hisTweet);

           
           }
           

           return historicTweets;
        }

        public async Task<List<twitteranalyzed>> GetAllBetweenNews(int @from, int to, int size)
        {
            DateTime newFrom = DateTime.Now.AddHours(-from);;
            DateTime newTo = DateTime.Now.AddHours(-to);
            Console.WriteLine();
            List<twitteranalyzed> historicTweets = new List<twitteranalyzed>();

            //var ps = _session.Prepare(" INSERT INTO tweet(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet , latitude , longitude) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ?)");
            var ps = await _session.PrepareAsync("SELECT * FROM covid  WHERE created_at >= ? AND  created_at <= ? and typeof = ? limit ?;");
            var statement = ps.Bind(newFrom , newTo , "news" , size);
            var rs = await _session.ExecuteAsync(statement);
            foreach (var row in rs)
            {
                twitteranalyzed hisTweet = new twitteranalyzed();
                hisTweet.id = row.GetValue<string>("id");
                hisTweet.created_at = row.GetValue<DateTime>("created_at");
                hisTweet.latitude = row.GetValue<Double>("latitude");
                hisTweet.longitude = row.GetValue<Double>("longitude");
                hisTweet.negativeConfidence = row.GetValue<Double>("negativeconfidence");
                hisTweet.positiveConfidence = row.GetValue<Double>("positiveconfidence");
                hisTweet.prediction = row.GetValue<string>("prediction");
                hisTweet.screen_name = row.GetValue<string>("screen_name");
                hisTweet.tweet = row.GetValue<string>("tweet");

                historicTweets.Add(hisTweet);

           
            }
           

            return historicTweets;
        }

        public async Task<List<twitteranalyzed>> GetAllBetweenCorona(int @from, int to,int size)
        {
            DateTime newFrom = DateTime.Now.AddHours(-from);;
            DateTime newTo = DateTime.Now.AddHours(-to);
            Console.WriteLine();
            List<twitteranalyzed> historicTweets = new List<twitteranalyzed>();

            //var ps = _session.Prepare(" INSERT INTO tweet(id , created_at , negativeconfidence , positiveconfidence , prediction , screen_name ,  tweet , latitude , longitude) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ?)");
            var ps = await _session.PrepareAsync("SELECT * FROM covid  WHERE created_at >= ? AND  created_at <= ? and typeof = ? limit ? ;");
            var statement = ps.Bind(newFrom , newTo, "corona" , size);
            var rs = await _session.ExecuteAsync(statement);
            foreach (var row in rs)
            {
                twitteranalyzed hisTweet = new twitteranalyzed();
                hisTweet.id = row.GetValue<string>("id");
                hisTweet.created_at = row.GetValue<DateTime>("created_at");
                hisTweet.latitude = row.GetValue<Double>("latitude");
                hisTweet.longitude = row.GetValue<Double>("longitude");
                hisTweet.negativeConfidence = row.GetValue<Double>("negativeconfidence");
                hisTweet.positiveConfidence = row.GetValue<Double>("positiveconfidence");
                hisTweet.prediction = row.GetValue<string>("prediction");
                hisTweet.screen_name = row.GetValue<string>("screen_name");
                hisTweet.tweet = row.GetValue<string>("tweet");

                historicTweets.Add(hisTweet);

           
            }
           

            return historicTweets;
        }

        public void CleanUp()
        {
            Console.WriteLine("Cleaning cassandra");

            _cluster.Shutdown();
        }
    }
}
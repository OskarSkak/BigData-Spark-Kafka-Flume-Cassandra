using System;
using System.Collections.Generic;

namespace spark_api.models
{
    public class ExtractDataObject
    {
        public string id { get; set; }
        public DateTime created_at { get; set; }
        public string tweet { get; set; }
        public string prediction { get; set; }
        public double positiveConfidence { get; set; }
        public double negativeConfidence { get; set; }
        public string screen_name { get; set; }
        //public Place place { get; set; }
        //public string coordinates { get; set; }
        //public string sentiment { get; set; }
        //public string text { get; set; }
        //public string screen_name { get; set; }
    }

    public class Place
    {
       public Bounding_box bounding_box { get; set; } 
    }

    public class Bounding_box
    {
       public List<List<List<double>>> coordinates { get; set; }
    }

    public class Sentiment
    {
        public string tweet { get; set; }
        public string prediction { get; set; }
        public double positiveConfidence { get; set; }
        public double negativeConfidence { get; set; }
    }
    
}
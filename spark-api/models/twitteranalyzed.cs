using System;
using System.Collections.Generic;

namespace spark_api.models
{
    public class twitteranalyzed
    {
        public string id { get; set; }
        public DateTime created_at { get; set; }
        public string tweet { get; set; }
        public string prediction { get; set; }
        public double positiveConfidence { get; set; }
        public double negativeConfidence { get; set; }
        public string screen_name { get; set; }
        
        public double latitude { get; set; }
        public double longitude { get; set; }
    }
    
    
    
}
package com.mycompany.app;

/**
 *
 * @author skakk
 */
public class SentimentAnalysisComparisonManager {
    final static String NEGATIVE_PREDICTION = "\"prediction\": \"Positive\"";
    
    public static boolean hasNegativeSentiment(String val){
        return val.contains(NEGATIVE_PREDICTION);
    }
}

package com.mycompany.app;

import java.util.Arrays;
import java.util.logging.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author skakk
 */
public class SentimentAnalysisComparisonManager {
    final static String NEGATIVE_PREDICTION = "negative";
    final static String PREDICTION = "prediction", SENTIMENT = "sentiment",
            NEGATIVE_CONFIDENCE = "negativeConfidence";
    final static double NEGATIVE_CONFIDENCE_THRESHOLD = 0.65;
    
    public static boolean hasNegativeSentiment(String val){
        return val.toLowerCase().contains(NEGATIVE_PREDICTION.toLowerCase());
    }
    
    public static boolean hasClearlyNegativeSentiment(String val){
        try{
            val = val.substring(1, val.length() -1);
            JSONObject jObject = new JSONObject(val);
            String prediction = jObject.getJSONObject(SENTIMENT).getString(PREDICTION);
            boolean overallAssessment = prediction.toLowerCase().contains("negative");
            double x = jObject.getJSONObject(SENTIMENT).getDouble(NEGATIVE_CONFIDENCE);
            return (x > NEGATIVE_CONFIDENCE_THRESHOLD) && overallAssessment;
        }catch(JSONException e){
            System.err.print(Arrays.toString(e.getStackTrace()));
        }
        return false;
    }
}

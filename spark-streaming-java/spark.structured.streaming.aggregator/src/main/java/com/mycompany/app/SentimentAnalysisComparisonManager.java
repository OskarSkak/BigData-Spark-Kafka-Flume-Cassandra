package com.mycompany.app;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author skakk
 */
public class SentimentAnalysisComparisonManager {
    private final static String NEGATIVE_PREDICTION = "negative", POSITIVE_PREDICTION = "positive";
    private final static String PREDICTION = "prediction", SENTIMENT = "sentiment";
    private final static String NEGATIVE_CONFIDENCE = "negativeConfidence", POSITIVE_CONFIDENCE = "positiveConfidence";
    private final static double NEGATIVE_CONFIDENCE_THRESHOLD = 0.65, POSITIVE_CONFIDENCE_THRESHOLD = 0.65;
    
    public static boolean hasNegativeSentiment(String val){
        return val.toLowerCase().contains(NEGATIVE_PREDICTION.toLowerCase());
    }
    
    public static boolean hasClearlyNegativeSentiment(String val){
        /*try{
            val = val.substring(1, val.length() -1);
            JSONObject jObject = new JSONObject(val);
            String prediction = jObject.getJSONObject(SENTIMENT).getString(PREDICTION);
            boolean overallAssessment = prediction.toLowerCase().contains(NEGATIVE_PREDICTION);
            double x = jObject.getJSONObject(SENTIMENT).getDouble(NEGATIVE_CONFIDENCE);
            return (x > NEGATIVE_CONFIDENCE_THRESHOLD) && overallAssessment;
        }catch(JSONException e){
            System.err.print(Arrays.toString(e.getStackTrace()));
        }
        return false;*/
        return false;
    }
    
    public static int hasClearlyPositiveOrNegativeSentiment(String val){
        Map<String, Double> confidenceCertaintyMap = extractConfidenceValues(POSITIVE_CONFIDENCE, NEGATIVE_CONFIDENCE, val);
        if(confidenceCertaintyMap.get(POSITIVE_CONFIDENCE) >= POSITIVE_CONFIDENCE_THRESHOLD) return 1;
        else if(confidenceCertaintyMap.get(NEGATIVE_CONFIDENCE) >= NEGATIVE_CONFIDENCE_THRESHOLD) return -1;
        else return 0;
    }
    
    private static Map<String, Double> extractConfidenceValues(String positiveIndicator, String negativeIndicator, String val){
        String negativeConfidence = "";
        String posititveConfidence = "";
        
        boolean negativeFound = false;
        boolean positiveFound = false;
        
        String segments[] = val.split(",");
        
        for(int i = 0; i < segments.length; i++){
            if(segments[i].contains(negativeIndicator) && !negativeFound){
                negativeConfidence = segments[i];
                negativeFound = true;
            }
            if(segments[i].contains(positiveIndicator) && !positiveFound){
                posititveConfidence = segments[i];
                positiveFound = true;
            }
        }
        
        Map<String, Double> res = new HashMap<>();
        
        if(!negativeConfidence.isBlank()) res.put(NEGATIVE_CONFIDENCE, extractConfidence(negativeConfidence));
        if(!posititveConfidence.isBlank()) res.put(POSITIVE_CONFIDENCE, extractConfidence(posititveConfidence));
        
        return res;
    }
    
    private static double extractConfidence(String val){
        double doublePortion = Double.parseDouble(val.replaceAll("[^0-9]", ""));
        return doublePortion / Math.pow(10, 16); //since val is always E15 away from 0-1
    }
}

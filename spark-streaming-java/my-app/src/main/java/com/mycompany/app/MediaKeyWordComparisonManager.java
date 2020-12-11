package com.mycompany.app;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author skakk
 */
public class MediaKeyWordComparisonManager {
    static ArrayList<String> keywords = new ArrayList<>();
    
    static{
        //Could be troublesome, we'll see
        File f = new File("./src/main/java/com/mycompany/app/MEDIA_KEY_WORDS.txt");
        
        try(BufferedReader in = new BufferedReader(
                                new FileReader(f))){
            String line = in.readLine();
            while(line != null){
                keywords.add(line);
                line = in.readLine();
            }
            in.close();
        } catch (IOException ex) {
            Logger.getLogger(CoronaKeyWordComparisonManager.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public static boolean isCorrelatedWithCoronaKeywords(String val){
        for(String keyword : keywords){
            if(val.toLowerCase().contains(keyword.toLowerCase()))
                return true;
        }
        return false;
    }
}

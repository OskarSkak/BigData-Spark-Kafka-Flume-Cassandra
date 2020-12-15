package com.mycompany.app;

import static com.mycompany.app.CoronaKeyWordComparisonManager.keywords;
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
    
    public static ArrayList<String> getKeywords(){
        return keywords;
    }
    
    static{
        //Could be troublesome, we'll see
        /*File f = new File("./src/main/java/com/mycompany/app/MEDIA_KEY_WORDS.txt");
        
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
        }*/
        keywords.add("Acute respiratory stress syndrome");
        keywords.add("ARDS");
        keywords.add("Asymptomatic"); 
        keywords.add("Case fatality rate"); 
        keywords.add("Clinical trial"); 
        keywords.add("Confirmed positive case"); 
        keywords.add("Contactless spreading"); 
        keywords.add("Containment area"); 
        keywords.add("Epidemic"); 
        keywords.add("Epidemic curve"); 
        keywords.add("Epidemiology"); 
        keywords.add("Essential business"); 
        keywords.add("Flattening the curve"); 
        keywords.add("Forehead thermometer"); 
        keywords.add("Herd immunity"); 
        keywords.add("Hydroxychloroquine"); 
        keywords.add("Immune surveillance");
        keywords.add("Immunosuppressed");
        keywords.add("Incubation period");
        keywords.add("Intensivist");
        keywords.add("and");
    }
    
    public static boolean isCorrelatedWithCoronaKeywords(String val){
        for(String keyword : keywords){
            if(val.toLowerCase().contains(" "+keyword.toLowerCase()+" "))
                return true;
        }
        return false;
    }
}

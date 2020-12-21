package com.mycompany.app;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author skakk
 */
public class CoronaKeyWordComparisonManager {
    static ArrayList<String> keywords = new ArrayList<>();
    
    public static ArrayList<String> getKeywords(){
        return keywords;
    }
    
    static{
        //Could be troublesome, we'll see
        //It was in fact troublesome - hard coded words now - very ugly, but works
        /*File f = new File("./src/main/java/com/mycompany/app/CORONA_KEY_WORDS.txt");
        
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
        keywords.add("Lockdown");
        keywords.add("National emergency");
        keywords.add("Pandemic");
        keywords.add("Person-to-person transmission");
        keywords.add("Physical distancing");
        keywords.add("PBE");
        keywords.add("Pre-symptomatic");
        keywords.add("Presumptive positive case");
        keywords.add("PUI");
        keywords.add("Remdesivir");
        keywords.add("Respirator");
        keywords.add("Self-isolation");
        keywords.add("Shelter-in-place");
        keywords.add("Spanish flu");
        keywords.add("Symptomatic");
        keywords.add("Vaccine");
        keywords.add("Ventilator");
        keywords.add("WHO");
        keywords.add("World health organization");
        keywords.add("Working from home");
        keywords.add("Covid-19");
        keywords.add("covid");
        keywords.add("corona");
        keywords.add("plague");
        keywords.add("wuhan virus");
        keywords.add("wuhan");
        keywords.add("china plague");
        keywords.add("Anthony Faucci");
        keywords.add("Faucci");
        keywords.add("Pfizer");
        keywords.add("BionTech");
        keywords.add("Pfizer Inc");
    }
    
    public static boolean isCorrelatedWithCovidKeywords(String val){
        for(String keyword : keywords){
            if(val.toLowerCase().contains(" "+keyword.toLowerCase()+" "))
                return true;
        }
        return false;
    }   
}

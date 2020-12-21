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
        keywords.add("mediaroom");
        keywords.add("MediaSocial");
        keywords.add("mediajob");
        keywords.add("mediacontent");
        keywords.add("mediateam");
        keywords.add("mediacenter");
        keywords.add("mediaone");
        keywords.add("mediainfluence");
        keywords.add("mediabias");
        keywords.add("mediablackout");
        keywords.add("MediaCityUK");
        keywords.add("MediaNoche");
        keywords.add("mediablasting");
        keywords.add("mediapromosi");
        keywords.add("medialuna");
        keywords.add("mediacorp");
        keywords.add("mediaspecialist");
        keywords.add("mediasosial");
        keywords.add("mediapark");
        keywords.add("MEDIAMogul");
        keywords.add("MediaPA");
        keywords.add("MediaKit");
        keywords.add("media bias");
        keywords.add("fake news");
        keywords.add("CNN");
        keywords.add("Forbes");
        keywords.add("AT&T");
        keywords.add("Comcast");
        keywords.add("Walt Disney");
        keywords.add("disney");
        keywords.add("viacom");
        keywords.add("national amusements");
        keywords.add("NBC");
        keywords.add("news corp");
        keywords.add("Fox News");
        keywords.add("wall street journal");
        keywords.add("new york post");
        keywords.add("viacom");
        keywords.add("cnn");
        keywords.add("hbo");
        keywords.add("cbs");
        keywords.add("Cozi TV");
        keywords.add("Sky");
        keywords.add("telemundo");
        keywords.add("telexitos");
        keywords.add("abc news");
        keywords.add("cbs news");
        keywords.add("fow news channel");
        keywords.add("msnbc");
        keywords.add("nbc news");
        keywords.add("the new york times");
        keywords.add("new york times");
        keywords.add("la times");
        keywords.add("los angeles times");
        keywords.add("LA times");
        keywords.add("L.A. times");
        keywords.add("usa today");
        keywords.add("the wall street journal");
        keywords.add("wall street journal");
        keywords.add("the washington post");
        keywords.add("washington post");
        keywords.add("los angeles daily news");
        keywords.add("bloomberg");
        keywords.add("vice news");
        keywords.add("huffpost");
        keywords.add("TMZ");
        keywords.add("CNET");
        keywords.add("NPR");
        keywords.add("the hollywood reporter");
        keywords.add("hollywood reporter");
        keywords.add("newsweek");
        keywords.add("TIMES");
        keywords.add("u.s. news & world report");
        keywords.add("the guardian");
        keywords.add("trump");
        keywords.add("white house");
        keywords.add("fake");
        keywords.add("election");
        keywords.add("election fraud");
        keywords.add("election2020");
        keywords.add("AOC");
        keywords.add("Pelosi");
        keywords.add("fraudulent");
    }
    
    public static boolean isCorrelatedWithCoronaKeywords(String val){
        for(String keyword : keywords){
            if(val.toLowerCase().contains(" "+keyword.toLowerCase()+" "))
                return true;
        }
        return false;
    }
}

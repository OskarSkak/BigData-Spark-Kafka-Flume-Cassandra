/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.app.kafka.producers;

/**
 *
 * @author skakk
 */
public class JavaRecord implements java.io.Serializable{
    private String word;
    
    public String getWord(){
        return word;
    }
    
    public void setWord(String word){
        this.word = word;
    }
}

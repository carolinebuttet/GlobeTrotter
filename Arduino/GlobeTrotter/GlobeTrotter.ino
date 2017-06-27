/* Globe Trotter
 * A tangible and interactive picture viewer
 * an original idea by Caroline Buttet
 * www.carolinebuttet.ch
 * 
 * Libraries used:
 * CapitiveSense Library
 * Paul Badger 2008
 * Uses a high value resistor e.g. 10M between send pin and receive pin
 * Resistor effects sensitivity, experiment with values, 50K - 50M. Larger resistor values yield larger sensor values.
 * Receive pin is the sensor pin - try different amounts of foil/metal on this pin
 * 
 * The keyboard library from Arduino
 * 
 * and the Encoder library
 * http://www.pjrc.com/teensy/td_libs_Encoder.html
 */
#include <CapacitiveSensor.h>
#include <Encoder.h>
#include "Keyboard.h"

/*countries*/
//threshold for capacitive sensing. Modify to suit your needs. 
int threshold = 45;

//ENCODER
long oldPosition  = -999;

//ENCODER---------
//My rotary encoder is a chinese clone so I had to debounce it with capacitors, like explained here (https://idyl.io/2017/02/28/robodyn-24-steps-rotary-encoder-review/) 
// Connect a 0.1µF capacitor from ground to CLK   (for debouncing)
// Connect a 0.1µF capacitor from ground to DT    (for debouncing)
Encoder myEnc(2, 3);
///

//setting the capacitive sensors (1 sensor per country)
CapacitiveSensor   cs_4_5 = CapacitiveSensor(4,5);    //Madagascar      // 10M resistor between pins 4 & 5, pin 6 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_6 = CapacitiveSensor(4,6);    //Namibia         // 10M resistor between pins 4 & 6, pin 7 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_7 = CapacitiveSensor(4,7);    //France          // 10M resistor between pins 4 & 7, pin 8 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_8 = CapacitiveSensor(4,8);    //Ethiopia        // 10M resistor between pins 4 & 8, pin 8 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_9 = CapacitiveSensor(4,9);    //China           // 10M resistor between pins 4 & 9, pin 9 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_10 = CapacitiveSensor(4,10);  //Vietnam         // 10M resistor between pins 4 & 10, pin 10 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_11 = CapacitiveSensor(4,11);  //Philippines     // 10M resistor between pins 4 & 11, pin 11 is sensor pin, add a wire and a pin to your desired country on your globe. 
CapacitiveSensor   cs_4_12 = CapacitiveSensor(4,12);  //Japan           // 10M resistor between pins 4 & 12, pin 12 is sensor pin, add a wire and a pin to your desired country on your globe. 



void setup()                    
{
   //begin serial communication
   Serial.begin(9600);
   //begin keyboard
   Keyboard.begin();
}

void loop()                    
{
    //update the encoder for the globe position.
    updateEncoder();
    //update capacitive sensors to find out if a country has been touched. 
    updateCapacitiveSensors();
}


void updateEncoder(){
  long newPosition = myEnc.read();
  if (newPosition != oldPosition) {
    
    //I am only reading every 4 steps, otherwise the pictures will update too quickly.
    if(newPosition % 4 ==0){
       Serial.println(newPosition/4);
       if(newPosition > oldPosition){
        //GOING COUNTERCLOCKWISE
        Keyboard.write('a');
       }
       else{
        //GOIGN CLOCKWISE
        Keyboard.write('s');
       }
    }
    oldPosition = newPosition;
  } 
 }

void updateCapacitiveSensors(){
    long total1 =  cs_4_8.capacitiveSensor(30);   //Ethiopia
    long total2 =  cs_4_5.capacitiveSensor(30);   //Madagascar
    long total3 =  cs_4_6.capacitiveSensor(30);   //Namibia
    long total4 =  cs_4_7.capacitiveSensor(30);   //France
    
    long total5 =  cs_4_9.capacitiveSensor(30);   //China
    long total6 =  cs_4_10.capacitiveSensor(30);  //Vietnam
    long total7 =  cs_4_11.capacitiveSensor(30);  //Japan
    long total8 =  cs_4_12.capacitiveSensor(30);  //Philippines
    
    Serial.print("\t");                    // tab character for debug windown spacing
    Serial.print(total1);                  // print sensor output 1
    Serial.print("\t");
    Serial.print(total2);                  // print sensor output 2
    Serial.print("\t");
    Serial.print(total3);                  // print sensor output 3
    Serial.print("\t");
    Serial.print(total4);                // print sensor output 4
    
    Serial.print("\t");
    Serial.print(total5);                // print sensor output 5
    Serial.print("\t");
    Serial.print(total6);                // print sensor output 6
    Serial.print("\t");
    Serial.print(total7);                // print sensor output 7
    Serial.print("\t");
    Serial.println(total8);                // print sensor output 8
    
    if(total1>threshold){
      Keyboard.write('e');
    }
    else if(total2>threshold){
      Keyboard.write('m');
    }
    else if(total3>threshold){
      Keyboard.write('n');
    }
    else if(total4>threshold){
      Keyboard.write('f');
    }
    else if(total5>threshold){
      Keyboard.write('c');
    }
    else if(total6>threshold){
      Keyboard.write('v');
    }
    else if(total7>threshold){
      Keyboard.write('j');
    }
    else if(total8>threshold){
      Keyboard.write('p');
    }
    
  }

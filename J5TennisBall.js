/*  jha 10/26/2013

Objectives

    - Get comfortable with javascript. time to move past CPR (copy, paste, refactor *tm*)
        I am using visual studio over a samba mount to the 'pi  :-)
    - Control a 120VAC LED traffice light via relays for close quarters parking assistance in 
        garage using ping ultransonic sensor.
    - Garage door opener 
        previously wrote windows phone app that controled Phidgets on a WCF service 
    - Current temperature in XML suitable for HomeAmation http://homeamation.azurewebsites.net/
      garage door toast notification on garage door opening. 

Hardware
    1 Raspberry Pi 
    2 Parallax dual relay boards http://www.parallax.com/product/27114 (if using huge LEDs)
        Beware current draw on micro processors even when using small LEDs.
    1 ping sensor
        Parallax ping http://www.parallax.com/product/28015
        or
        HC-SR04 or equilavent http://rodaw.me/HnPY7l
    3 LEDs to taste. project will be easy to modify for other types of indicators. Perhaps 8 led bar graph
    1 Arduino. I'm using a Duemilanove http://arduino.cc/en/Main/arduinoBoardDuemilanove
        Note: I and others have reported difficulties using Leonardo and Leonardo clones.
    1 12VDC power supply for relays
    1 ~9VDC power supply for arduino (powering sensors)
        I overloaded the USB supply after adding the ping after the relays.


*/

var j5 = require("johnny-five"),
    board, button;

board = new j5.Board();

board.on("ready", function () {

    var ping = new j5.Ping({
        pin: 8,
        freq: 250
    });

    button = new j5.Button(
        {
            pin: 7,
            holdtime: 500,
            invert: true
        });

    var ginches = 20;
    button.on("hold", function () {

        offset = ginches;
        console.log("offset = " + offset);
    });

    function enableTrafficLights() {
        redLight.on();
        yellowLight.on();
        greenLight.on();

    } function disableTrafficLights() {
        redLight.off();
        yellowLight.off();
        greenLight.off();
    }

    function initTrafficLights() {
        // TODO might be better / more intuitive to use pin rather than Led
        redLight = new j5.Led(3);
        yellowLight = new j5.Led(2);
        greenLight = new j5.Led(4);
    }

    //ping.on("data", function (err, value) {
    //    console.log("data", value);
    //});

    /*
                                        main gaps loop
    */
    var lowerLimit = 2;
    var offset = 5;

    ping.on("change", function (err, value) {
        ginches = this.inches;

        // flashing red
        if (this.inches < (lowerLimit + offset)) {
            console.log("flashing red");
            redLight.strobe(200);
            yellowLight.off();
            greenLight.off();
            //goto end
        }
            // solid red
        else if (this.inches > lowerLimit + offset && this.inches < 6 + offset) {
            console.log("red");
            redLight.off().stop();
            redLight.on();
            yellowLight.off();
            greenLight.off();
        }
            // red and yellow
        else if (this.inches > 6 + offset && this.inches < 10 + offset) {
            console.log("red and yellow");
            redLight.off().stop();
            redLight.on();
            yellowLight.on();
            greenLight.off();
        }
            // yellow
        else if (this.inches > 10 + offset && this.inches < 20 + offset) {
            console.log("yellow");
            redLight.off();
            yellowLight.on();
            greenLight.off();
        }
            // green and yellow
        else if (this.inches > 20 + offset && this.inches < 35 + offset) {
            console.log("green and yellow");
            greenLight.on();
            yellowLight.on();
            redLight.off();
        }
            // green
            // if (this.inches > 35 + offset) {
        else if (this.inches > 55 + offset) {
            console.log("green");
            redLight.off();
            yellowLight.off();
            greenLight.on();
        }

        // green

        // off
        //    redLight.off();
        //    yellowLight.off();
        //    greenLight.off(); 

        //end:

        //console.log(typeof this.inches);
        //console.log("Object is " + this.inches + "inches away");
    });

    initTrafficLights();

    this.repl.inject({
        redLight: redLight
    });

    console.log("You can interact with the RGB LED via the variable 'led' e.g. led.on();\n Hit control-D to exit.\n >> ");
    console.log('try "on", "off", "toggle", "strobe", "stop" (stops strobing)');

});

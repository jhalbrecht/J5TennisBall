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
    1 Beagle Board Black or Raspberry Pi
    2 Parallax dual relay boards http://www.parallax.com/product/27114 (if using huge LEDs)
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


    Questions

    I hope my robots.txt will block search indexing while in the early not ready for prime time
    stages of the project.

*/

var j5 = require("johnny-five"),
    board, button;

board = new j5.Board();

board.on("ready", function () {

    var ping = new j5.Ping({
        pin: 8,
        freq: 1000
    });

    button = new j5.Button(
        {
            pin: 7,
            holdtime: 500,
            invert: true
        });

    var isButton = true;

    //button.on("down", function () {

    //});

    button.on("hold", function () {
        if (isButton) {
            enableTrafficLights();
            console.log("initTrafficLights");
        } else {
            disableTrafficLights();
            console.log("disableTrafficLights");
        }
        isButton = !isButton;
    });

    function enableTrafficLights() {
        redLight.strobe(333);
        yellowLight.strobe(444);
        greenLight.strobe(555);

        //redLight.on();
        //yellowLight.on();
        //greenLight.on();

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

        //redLight.strobe(333);
        //yellowLight.strobe(444);
        //greenLight.strobe(555);
    }

    ping.on("data", function (err, value) {
        console.log("data", value);
    });

    ping.on("change", function (err, value) {

        console.log(typeof this.inches);
        console.log("Object is " + this.inches + "inches away");
    });

    initTrafficLights();

    this.repl.inject({
        redLight: redLight
    });

    console.log("You can interact with the RGB LED via the variable 'led' e.g. led.on();\n Hit control-D to exit.\n >> ");
    console.log('try "on", "off", "toggle", "strobe", "stop" (stops strobing)');

});

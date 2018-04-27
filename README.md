# bleController
A rudimentary, proof of concept controller for Kamigami robots written with Javascript. It relies heavily on the web-bluetooth-api<sup>1</sup>. Currently only works with OSX and ChromeOS due to chrome bluetooth only working on those operating systems.

## Setup
To run this code, I used node.js, though just opening the index file should work. The meat of the web page is in the /public/src/robot.js file. This is the interface between the robot and computer.

## robot.js
This file contains a class called Kamigami. As of now, I have implemented most of the basic functions for your typical Kamigami robot. That includes setting eye LEDs and motor speeds, getting battery information, requesting data about the motor, LEDs, Accelerometer, and ambient light.

## Getting Started
When testing this app, the most important thing is to always start by connecting to the robot. The Kamigami class relies on being connected to a robot to work. A dropdown menu will appear in the web browser allowing you to select a bluetooth device to work. The Kamigami robots typically show up as KRB0001 on the device list. After connecting to the robot, its eyes should light up green. You can then use the controls to set its speed, eye color, and get information from it.

## Blocky Implementation
Blockly<sup>2</sup> is a visual coding system developed by Google. The current development push is on implementing basic robot functions in Blockly as a system for programming Kamigami robots. I have currently hit a wall in development while trying to implement a "wait" block to delay blocks of code. The Blockly files are located in the folder /public/src/blockly. The basic motor block works though. 

## Way Forward
I can see two potential paths for development on this web page

### Blockly Development
The first is focusing on Blockly and getting a smooth implementation of all robot features. This includes implementing all robot functions and data processing with useable blocks. I can see this being more important for Kamigami robots as an educational tool. 

### Controller Development
The second path forward is controller development. As of right now, it is very hard to control the robot with this web app. Development would be on designing a controller (like an arcade stick) and display for reading info from the robot. I can see this being more important to Kamigami robots as a toy. 

## Final Thoughts
Either way, the actual design and aesthetic of the page need work. I was focusing on functionality through most of my development so the visuals took a bit of a back seat. I am not sure how to even approach visual design and don't have the time left in the semester to begin approaching that beast. 

<sup>1</sup>:[Web-Bluetooth-API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)  
<sup>2</sup>: [Blockly-API](https://developers.google.com/blockly/)

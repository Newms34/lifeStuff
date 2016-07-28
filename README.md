#LifeStuff: Another cellular automaton simulation

##Contents:

 - [Description](#description)
 - [Rules](#rules)
 - [Use](#use)
 - [Upcoming Features](#upcoming-features)
 - [Credits](#credits)

##Description

This is a (very simple!) flocking. It's written entirely in vanilla JS, so just sit back and watch. Or mess with the settings.

##Rules (old version)

The rules are comparatively simple, but are as follows:

 - Every particle has a desired 'range' of distances (specified in main.js as minDist and maxDist) from its nearest neighbor within which it's happy.
 - If a particle exits this range (i.e., is too close or too far from its nearest neighbor), it'll do an about-face and attempt to move back into range. They can only do this every so often.
 - Particles are colored to respond to how close to the ideal 'average' they are.
 - If the particle happens to be within one half of the minimum distance from another particle, and the particles have not recently interacted, the two will undergo one of two interactions:
  - One particle will 'kill' the other, removing it from the board. This is represented by a skull icon on the killing particle.
  - The two particles will mate, producing another particle. The two mating particles are represented by a heart, while the baby is, well, a baby.
 - The particles are afraid of the giant metal pipe. If it moves near them, they will attempt to run directly away from it. Particles that have been affected by the pipe will be blue temporarily. 

##Use

Just open indexOld.html. If you wanna try playing with the settings a bit, change minDist and maxDist in main.js. I'd suggest you specify between 70 and 600 particles.

##Upcoming Features

You might notice a file called 'index.html'. That's the basis for a new module, involving ecology simulations. I'm not going to release it until I have a full simulation of basic ecological principles.

##Credits

This page was written by me, [David Newman](https://github.com/Newms34)
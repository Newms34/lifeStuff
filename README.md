#LifeStuff: Another cellular automaton simulation

##Contents:

 - [Description](#description)
 - [Rules](#rules)
 - [Use](#use)
 - [Known Issues](#known-issues)
 - [Upcoming Features](#upcoming-features)
 - [Credits](#credits)

##Description

This project consists of two separate modules. The [first](oldIndex.html) is a flocking simulation, with only two per-particle behaviors (other than movement): mating and fighting (which results in one of the particles 'dying').

The [second module](index.html) is an ecology simulation, with a full food web.

##Rules
###Flocking Sim:

The rules are comparatively simple, but are as follows:

 - Every particle has a desired 'range' of distances (specified in main.js as minDist and maxDist) from its nearest neighbor within which it's happy.
 - If a particle exits this range (i.e., is too close or too far from its nearest neighbor), it'll do an about-face and attempt to move back into range. They can only do this every so often.
 - Particles are colored to respond to how close to the ideal 'average' they are.
 - If the particle happens to be within one half of the minimum distance from another particle, and the particles have not recently interacted, the two will undergo one of two interactions:
  - One particle will 'kill' the other, removing it from the board. This is represented by a skull&#128128; icon on the killing particle.
  - The two particles will mate, producing another particle. The two mating particles are represented by hearts&#9825;, while the baby is, well, a baby&#128700;.
 - The particles are afraid of the giant metal pipe (you probably would be too if huge piece of metal was swinging around near you). If it moves near them, they will attempt to run directly away from it. Particles that have been affected by the pipe will be blue temporarily. 

###Ecology Sim:

The ecology simulation can be thought of as a very simple 'game', in the same vein as something like Sim Life or Sim Earth. Basically, you play by creating a food web. The survival of each animal 'species' depends largely on two factors:

 1. Having available and appropriate food. For example, pandas&#128060; will *only* eat grass&#8992;<sup>1</sup>. If you have no grass&#8992; organisms, any pandas&#128060; you have will starve. 
 2. Having available mating partners. Each organism is randomly assigned either female or male on creation ('birth'). If you do not have enough at least one male and one female of a particular species, that species will (most likely!<sup>2</sup>) eventually go extinct.

The survival of plant ('producer') species is dependent, similarly, on two factors:

 1. Not being overeaten. If your pandas&#128060; eat all of the grass&#8992;, obviously there'll be no more grass&#8992; (and eventually, no more pandas&#128060;).
 2. Randomly reproducing at a high enough rate. For now, this only happens 1% of the time (i.e., a plant reproduces once every 100 turns on average). I will adjust this later if needed.

The rate at which organisms are born and reach maturity is based on real-world (adjusted) data. Gestation is in days, and Maturity is based in weeks. The exception to this, of course, is the dragon &#128009;, whose numbers are based on estimates of theropod dinosaur ontogeny<sup>3</sup>. I've adjusted the numbers so that one week for the maturity timer is equivalent to one day for the gestation timer. This is simply done so that you're not waiting around for hours!

##Use
###Flocking Sim:

Just open indexOld.html. If you wanna try playing with the settings a bit, change minDist and maxDist in main-old.js. I'd suggest you specify between 70 and 600 particles.

###Ecology Sim:

When you open the page, the first thing you'll see is the 'Customize your Ecosystem Dialog'. Using the suggestions above, pick a number of organisms for each species you want. Click "Make It So" when you're ready to see your ecosystem! 

##Known Issues

The stability of the ecology app has not yet been finalized. Be aware that it may crash more often than not! However, I wanted to release this anyway, just to see what folks do with it!
Also, the warnings in the Custom Your Ecosystem box may not disappear as appropriate. If this occurs, try adjusting the numbers slightly, and then adjusting them back.

##Upcoming Features:

 - Better stabilization of ecosystems.
 - Improved auto-suggest for ecosystem composition, including trophic levels (i.e., there should be far more primary producers than apex predators).
 - Better monitoring of exactly what's going on (such as a window that shows current organism populations).

##Credits

This page was written by me, [David Newman](https://github.com/Newms34)

----
<sup>1</sup><small>Bamboo is technically a type of grass&#8992;.</small>

<sup>2</sup><small>The only exception, of course, is if the organism is *really* good at hunting, and never dies of starvation.</small>

<sup>3</sup> <small>Bone morphology tells us that large theropods (like *Tyrannosaurus*) reached maturity in around 15-20 years, or 780 weeks, which is actually surprisingly fast for such a large animal. As for gestation time, this is a little more difficult to estimate. I'm extending the fast growth into the gestation (egg) phase slightly, but we're still dealing with a very large animal here. Similarly large extant animals, such as rhinos and whales, seem to have gestation periods in the range of 14-19 months. As such, I'm ascribing 13 months to *Tyrannosaurus*, and therefore the dragon&#128009;. </small>
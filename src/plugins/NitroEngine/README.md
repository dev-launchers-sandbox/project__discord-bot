#Nitro Engines

##Overview

This plugin adds a Discord Nitro hunting game to the server. On random intervals,
and triggered by chat activity, the bot will send an embedded message in a predetermined
channel "containing" a "fragment" of a Nitro Engine. When all of the pieces of the Nitro
Engine have been collected they can then be assembled into a full Nitro Engine.
Nitro Engines can then be redeemed for a Discord Nitro.

###Nitro Engine Parts
These are the collectible pieces that make up a Nitro Engine. They include:

- Combustion Chamber
- Carburetor
- Piston
- Cylinder
- Exhaust

###Nitro Engine
This item can be crafted by combining one of each "Nitro Part", and can be
redeemed for 1 Discord Nitro Membership

###Part Drops
Parts Boxes drop in one of two scenarios:

- On a scheduled interval which drops regular parts every X minutes
- On a timeout triggered by a message sent in a channel, based on some small chance value

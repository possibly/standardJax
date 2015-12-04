# standardJax
Applejax but played by writing programs that receive a JSON payload via stdin and respond via stdout with simple text strings that conform to an api. Its easier then it sounds.

## Writing your own AI for standardJax.
The only required portion of a program is that it must specify what language it is written in, like so:
```javascript
1. #!/usr/local/bin/node
```
Currently, this path is relative to my computer. See the section titled "supported languages" to see how you can write a program in your language.

To make a decision, just output text to stdout. For example:
```javascript
2. console.log('move left');
```

standardJax will decide when your programs turn is, execute your program, and read its `stdout.`

When you are finished writing your program, send your program to me. My email is tylerbrothers1@gmail.com.

## What information does my program have available to it? How do I access that info?
Your program gets information about the game state via `stdin`. `stdin` is an abstraction that finds many uses in UNIX-y operating systems, among many other places. It is ok to think of `stdin`, for the purposes of this game, as an argument passed implicitly into your program when standardJax asks your program to play. Your language must (and probably will) have some way of retrieving the information standardJax passes into your program via `stdin`.

The information passed into `stdin` is formatted in JSON. Your language probably has some library that parses JSON, and I recommend you use it instead of re-inventing the wheel by parsing the JSON by hand.

That information looks like this:
```javascript
{
  "action": "decide",
  "info": {
    "status": "alive",
    "name": "yourprogram.js",
    "vision": "2",
    "speed": "1",
    "apples": 0,
    "row": 32,
    "col": 33,
    "myWorld": [
      [
        0,
        0,
        "tree",
        0,
        0
      ],
      [
        0,
        0,
        "tree",
        0,
        0
      ],
      [
        0,
        0,
        "yourprogram.js",
        0,
        0
      ],
      [
        0,
        0,
        0,
        "anotherplayer.java",
        0
      ],
      [
        0,
        0,
        0,
        0,
        0
      ]
    ]
  }
}
```

## Understanding game state information
The game state provided to your program via `stdin` is split into two sections: `action` and `info`.

`action` will either be `play` or `decide`. If its `play`, your free to take any action in the Player API. If its `decide`, you have to decide whether to `steal` or `share`. Outputting `steal` or `share` is enough if your called upon to `decide`.

`info` contains all the info your need during your `play` action. Currently, only `info`.`myWorld` is of any interest. `info`.`myWorld` is a 2d array, consisting of you in the center and your neighbors in the surrounding corners. `tree` represents the tree's in the game, which you can `gather` from. 0 represents free space that you can move onto. The only other thing that populates the world currently is other players, represented by their program's name.

## Player API - actions you may output from your program.
* move (left | right | up | down): move your player character in the direction specified.
* gather: if your are adjacent to a 'tree', then take 1 apple from it.
* steal | share: Attempt to steal | share with another player in your vision. standardJax executes the other program with the "decide" action, and that program that also chooses steal or share (if the programmer did not specify, 'steal' is automatically chosen for that program). The prisoners dilemma bimatrix describes the possible outcome of this interaction.
```
                Share         Steal
        -----------------------------------
Share   | (0.25,  0.25)  | (-0.50, 1.50)  |
Steal   | (1.50, -0.50)  | (-0.25, -0.25) |
        -----------------------------------
```

## Supported languages
Anything that comes with OSX.
Java: /usr/bin/java
Python: /usr/bin/python
Node: /usr/local/bin/node
Ruby: /Users/tbro/.rvm/rubies/ruby-2.2.2/bin/ruby

## Example output from a round of standardJax
node main.js
```javascript
another.js: input was {"action":"play","info":{"status":"alive","name":"another.js","vision":"2","speed":"1","apples":0,"row":60,"col":98,"myWorld":[[0,0,0,0,0],[0,0,0,0,"another.js"],[0,0,"tree",0,"tree"],[0,0,0,"tree",0]]}}

another.js move,left successfully.
{ status: 'alive',
  name: 'another.js',
  vision: '2',
  speed: '1',
  apples: 0,
  row: 60,
  col: 97,
  myWorld: 
   [ [ 0, 0, 0, 0, 0 ],
     [ 'tree', 0, 0, 0, 0 ],
     [ 0, 0, 'another.js', 0, 0 ],
     [ 0, 'tree', 0, 'tree', 0 ],
     [ 0, 0, 0, 'tree', 0 ] ] }

gatherer.js: input was {"action":"play","info":{"status":"alive","name":"gatherer.js","vision":"2","speed":"1","apples":0,"row":13,"col":89,"myWorld":[[0,0,0,0,0],[0,0,0,0,0],[0,"tree","gatherer.js",0,0],[0,0,0,0,0],[0,0,0,0,0]]}}

gatherer.js gathered 1 apple successfully!
{ status: 'alive',
  name: 'gatherer.js',
  vision: '2',
  speed: '1',
  apples: 1,
  row: 13,
  col: 89,
  myWorld: 
   [ [ 0, 0, 0, 0, 0 ],
     [ 0, 0, 0, 0, 0 ],
     [ 0, 'tree', 'gatherer.js', 0, 0 ],
     [ 0, 0, 0, 0, 0 ],
     [ 0, 0, 0, 0, 0 ] ] }

poop.js: input was {"action":"play","info":{"status":"alive","name":"poop.js","vision":"2","speed":"1","apples":0,"row":89,"col":86,"myWorld":[[0,0,0,0,0],[0,0,0,0,0],[0,0,"poop.js",0,0],[0,0,0,0,0],[0,0,0,0,0]]}}

[Error: malformed,action! is not a valid action.]
{ status: 'alive',
  name: 'poop.js',
  vision: '2',
  speed: '1',
  apples: 0,
  row: 89,
  col: 86,
  myWorld: 
   [ [ 0, 0, 0, 0, 0 ],
     [ 0, 0, 0, 0, 0 ],
     [ 0, 0, 'poop.js', 0, 0 ],
     [ 0, 0, 0, 0, 0 ],
     [ 0, 0, 0, 0, 0 ] ] }

thief.js: input was {"action":"play","info":{"status":"alive","name":"thief.js","vision":"2","speed":"1","apples":0,"row":36,"col":26,"myWorld":[[0,0,0,0,"tree"],[0,0,0,0,"tree"],[0,0,"thief.js",0,0],[0,0,"tree",0,0],[0,0,"tree",0,0]]}}

another.js: input was {"action":"decide","info":{"status":"alive","name":"another.js","vision":"2","speed":"1","apples":0,"row":60,"col":97,"myWorld":[[0,0,0,0,0],["tree",0,0,0,0],[0,0,"another.js",0,0],[0,"tree",0,"tree",0],[0,0,0,"tree",0]]}}

[Error: steal,another.js did not work since thief.js could not see another.js]
{ status: 'alive',
  name: 'thief.js',
  vision: '2',
  speed: '1',
  apples: 0,
  row: 36,
  col: 26,
  myWorld: 
   [ [ 0, 0, 0, 0, 'tree' ],
     [ 0, 0, 0, 0, 'tree' ],
     [ 0, 0, 'thief.js', 0, 0 ],
     [ 0, 0, 'tree', 0, 0 ],
     [ 0, 0, 'tree', 0, 0 ] ] }

game over
```

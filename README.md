# standardJax
Applejax but played by writing programs that recieve a JSON payload via stdin and respond via stdout with simple text strings that conform to an api. Its easier then it sounds.

# Current output:
node main.js
```javascript
another.js: input was {"action":"play","info":"{\"status\":\"alive\",\"name\":\"another.js\",\"vision\":\"2\",\"speed\":\"1\",\"apples\":0,\"row\":9,\"col\":8,\"myWorld\":[0,0,0,0,0,0,0,0,0,0,0]}"}

another.js move,left successfully.
{"status":"alive","name":"another.js","vision":"2","speed":"1","apples":0,"row":9,"col":7,"myWorld":[0,0,0,0,0,0,0,0,0,0,0,0,0,0]}

poop.js: input was {"action":"play","info":"{\"status\":\"alive\",\"name\":\"poop.js\",\"vision\":\"2\",\"speed\":\"1\",\"apples\":0,\"row\":3,\"col\":1,\"myWorld\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}"}

[Error: malformed,action! is not a valid action.]
{"status":"alive","name":"poop.js","vision":"2","speed":"1","apples":0,"row":3,"col":1,"myWorld":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}

thief.js: input was {"action":"play","info":"{\"status\":\"alive\",\"name\":\"thief.js\",\"vision\":\"2\",\"speed\":\"1\",\"apples\":0,\"row\":3,\"col\":6,\"myWorld\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}"}

another.js: input was {"action":"decide","info":"{\"status\":\"alive\",\"name\":\"another.js\",\"vision\":\"2\",\"speed\":\"1\",\"apples\":0,\"row\":9,\"col\":7,\"myWorld\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0]}"}

[Error: steal,another.js did not work since thief.js could not see another.js]
{"status":"alive","name":"thief.js","vision":"2","speed":"1","apples":0,"row":3,"col":6,"myWorld":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
```

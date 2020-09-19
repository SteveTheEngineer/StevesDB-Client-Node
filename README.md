# StevesDB-Client-Node
[StevesDB](https://github.com/SteveTheEngineer/StevesDB-Server) database client written for Node.js

# Usage
Connecting to a StevesDB Server and logging in:
```js
const { StevesDBClient } = require("stevesdb-client-node");

const client = new StevesDBClient();

async function run() {
    try {
        await client.connect("127.0.0.1", 2540); // Connect to the server
    } catch(e) {
        console.error(`Unable to connect to the server: ${e}`);
        return;
    }
    if(!await client.login("stevesdb", "password")) { // Log in to the server and print a message if the provided credentials are invalid
        console.error("Invalid username or password");
        return;
    }
}
run();
```
You can read more about the client features [here](https://stevetheengineer.github.io/StevesDB-Client-Node/index.html)
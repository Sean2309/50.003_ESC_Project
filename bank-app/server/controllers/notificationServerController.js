const WebSocket = require('ws');
let userId;
//establishes connection with url to a specific port
const wss = new WebSocket.Server({ port: 8080 });

// Keep track of connected clients - multiple logged in users
const clients = new Map();


wss.on('connection', async (connection, req) => {

  //retrieves userId from url
  //E.g. ws://localhost:8080/?uuid=1234567
  userId =  req.url.replace('/?uuid=', '');

  // Store the WebSocket connection using the client identifier
  //key is userId, value is unique websocket connection
  clients.set(userId, connection);
  console.log("connection received, ID: " + userId);
  

  // Handle WebSocket connection

  // Event listener for incoming messages (from client - frontend)
  connection.on('message', (message) => {
  console.log(`Received message from client ${userId}: ${message}`);

  //used to send message to client, use this function to send push notification content
  connection.send(`You sent: ${message}`);

  });

  // Event listener for connection close
  connection.on('close', () => {
    console.log(`Client ${userId} disconnected`);

    // Remove the client from the collection when it disconnects
    clients.delete(userId);
  });
});



module.exports = {clients, wss};

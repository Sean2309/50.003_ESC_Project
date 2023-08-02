const WebSocket = require('ws');
const ResendNotification = require('./resendNotification').ResendNotification;
let membershipId;
//establishes connection with url to a specific port
const wss = new WebSocket.Server({ port: 8080 });


// Keep track of connected clients - multiple logged in users
const clients = new Map();

wss.on('connection', async (connection, req) => {

  //retrieves membershipId from url
  //E.g. ws://localhost:8080/?uuid=1234567
  membershipId =  req.url.replace('/?uuid=', '');

  // Store the WebSocket connection using the client identifier
  //key is membershipId, value is unique websocket connection
  clients.set(membershipId, connection);
  console.log("connection received, ID: " + membershipId);

  // Handle WebSocket connection

  // Event listener for incoming messages (from client - frontend)
  connection.on('message', (message) => {
  console.log(`Received message from client ${membershipId}: ${message}`);
  ResendNotification.resendNotif(message);

  //used to send message to client, use this function to send push notification content
  connection.send(`You sent: ${message}`);

  });

  // Event listener for connection close
  connection.on('close', () => {
    console.log(`Client ${membershipId} disconnected`);

    // Remove the client from the collection when it disconnects
    clients.delete(membershipId);
  });
});



module.exports = {clients};

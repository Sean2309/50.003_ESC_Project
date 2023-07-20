const WebSocket = require('ws');
let membershipID;


const wss = new WebSocket.Server({ port: 8080 });

// Keep track of connected clients
const clients = new Map();

wss.on('connection', async (connection, req) => {

  membershipID =  req.url.replace('/?uuid=', '');
  // Store the WebSocket connection using the client identifier
  clients.set(membershipID, connection);
  console.log("connection received, ID: " + membershipID);
  // Handle WebSocket connection

  // Event listener for incoming messages
  connection.on('message', (message) => {
  console.log(`Received message from client ${membershipId}: ${message}`);

  // Example: Echo the received message back to the client
  connection.send(`You sent: ${message}`);

  });

  // Event listener for connection close
  connection.on('close', () => {
    console.log(`Client ${membershipID} disconnected`);
    // Remove the client from the collection when it disconnects
    clients.delete(membershipID);
  });
});



async function sendMessagetoClient(clients, membershipID, outcomeCode){
  let userConnection = clients.get(membershipID);
  if (!userConnection){
    console.log("User Websocket Connection not found - not in clients")
    return;
  }
  else if (userConnection.readyState === WebSocket.OPEN){
    userConnection.send(outcomeCode);
    console.log(membershipID + " websocket connection found") }
  else{
    console.log(membershipID + " websocket connection closed" )
  }
}




module.exports = {clients, sendMessagetoClient};

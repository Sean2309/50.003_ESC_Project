const WebSocket = require('ws');

async function sendMessagetoClient(clients, membershipId, outcomeCode){
    let userConnection = clients.get(membershipId);
    if (!userConnection){
      console.log("User Websocket Connection not found - not in clients")
      return;
    }
    else if (userConnection.readyState === WebSocket.OPEN){
    //send outcomeCode to frontend to display on notification
      userConnection.send(outcomeCode);
      console.log(membershipId + " websocket connection found") }
    else{
      console.log(membershipId + " websocket connection closed" )
    }
  }

module.exports = {sendMessagetoClient};
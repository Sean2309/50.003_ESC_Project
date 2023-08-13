const WebSocket = require('ws');


async function sendMessagetoClient(clients, userId, message, messageType){

  let userConnection = clients.get(userId);

  //if user is not logged in , userConnection would not be found
  if (!userConnection){
    console.log("User Websocket Connection not found - not in clients")
    return;
  }
  else if (userConnection.readyState === WebSocket.OPEN){
  //send outcomeCode to frontend to display on notification
    const data_to_send = {
      messageBody: message,
      messageType: messageType
    }
    userConnection.send(JSON.stringify(data_to_send));
    console.log(userId + " websocket connection found") }
  else{
    console.log(userId + " websocket connection closed" )
  }
}

module.exports = {sendMessagetoClient};


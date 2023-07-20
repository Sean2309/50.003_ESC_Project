import NotificationStyle from "./NotificationStyle";
import React, {Component} from "react";
const membershipID = '1234568';

class NotificationLogic extends Component {
    render() {
        return (
        <div>
            <button onClick={() => new NotificationStyle().showNotification()}>Show notification</button></div>
        );
    }

}

const url = 'ws://localhost:8080?uuid=' + membershipID;
const socket = new WebSocket(url);

// Event listener for connection open
socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
});

// Event listener for incoming messages
socket.addEventListener('message', (event) => {
  const message = event.data;
  new NotificationStyle().showNotification()
  console.log('Received message:', message);
});

// Event listener for connection close
socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

// Event listener for connection error
socket.addEventListener('error', (event) => {
  console.error('WebSocket connection error:', event);
});


export default NotificationLogic;
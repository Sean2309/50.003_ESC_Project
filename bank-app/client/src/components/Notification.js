import { useEffect } from "react";
import NotificationStyle from "./NotificationStyle";

const Notification = ({ children, id }) => {

  useEffect(() => {
    const url = `ws://localhost:8080?uuid=${id}`; 
    const socket = new WebSocket(url);
    
    console.log(url)

    // Event listener for connection open
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection established');
    });

    // Event listener for incoming messages
    socket.addEventListener('message', (event) => {
      const message = event.data;
      new NotificationStyle().showNotification(message)
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

  }, [id]);

  return children;
};


export default Notification;

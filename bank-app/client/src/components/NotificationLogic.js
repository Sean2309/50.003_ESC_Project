import NotificationStyle from "./NotificationStyle";

//assuming every user has unique membershipID in each bank
const membershipID = '1234567'; //get this after user logs in 


const url = 'ws://localhost:8080?uuid=' + membershipID;
const socket = new WebSocket(url);

const NotificationLogic = () =>{
   
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

    // Clean up the WebSocket connection on component unmount

    
  
  };
  
  export default NotificationLogic;
  
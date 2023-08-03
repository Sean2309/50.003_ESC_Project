/*
things to test:
WebSocket connection - done
WebSocket sending - done
mongoDb connection
- create collection
- create data
- retrieve data
*/

//==================== WebSocket integration test =====================//

// __tests__/websocket.test.js
const WebSocket = require('ws');

describe('WebSocket connection', () => {
  let ws;
  let client1;

  beforeEach(() => {
    const url = "ws://localhost:8081"
    ws = new WebSocket.Server({ port: 8081 });
    client1 = new WebSocket(url);
  });

  afterEach(() => {
    // Close the WebSocket connection after each test

    ws.close();

  });

  test('WebSocket server is connected and can send message to client', () => {
    const message1 = 'Hello, WebSocket!';
    
    ws.on('connection', async (connection, req) => {
      connection.on('open', () => {
      console.log("websocket sent message")
      connection.send(message1);
      })
    });

    client1.addEventListener('message', (event) => {
      const message = event.data;
      console.log("client received message")
      expect(message).toBe(message1);
     });
  })

  test('WebSocket client can send messsage to server', () => {
    const message1 = 'Hello, WebSocket!';
    
    ws.on('connection', async (connection, req) => {
      connection.on('message', (message) => {
        console.log("websocket got message")
      expect(message).toBe(message1);
    })});
  
    client1.addEventListener('open', () => {
      console.log("client1 sent message")
        client1.send(message1);
      });
  })



})

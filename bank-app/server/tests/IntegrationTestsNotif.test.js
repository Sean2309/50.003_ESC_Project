
//==================== WebSocket integration test =====================//

// __tests__/websocket.test.js
const WebSocket = require('ws');

describe('WebSocket connection', () => {
  let ws;
  let client1;
  const url = "ws://localhost:8081"

  beforeEach(() => {
    ws = new WebSocket.Server({ port: 8081 });
    client1 = new WebSocket(url);
  });

  afterEach(() => {
    // Close the WebSocket connection after each test
    client1.close();
    ws.close();

  });

  test('WebSocket server is connected and can send message to client', async () => {
    const message1 = 'Hello, WebSocket!';
    let counter = 0;

    ws.on('connection', async (connection, req) => {
      console.log("websocket sent message")
      connection.send(message1);
    });

    const promise = new Promise((resolve) => {

      client1.addEventListener('message', (message) => {
        console.log('message received');
        counter++;
        resolve();
      });
    })

    await promise;
    expect(counter).toBe(1);

  })

  test('WebSocket can connect to multiple clients', async () => {
    const message1 = 'Hello, WebSocket!';
    const client2 = new WebSocket(url);
    let counter = 0;
    
    ws.on('connection', async (connection, req) => {
      console.log("websocket sent message")
      connection.send(message1);
    });

    const promise = new Promise((resolve) => {

      client1.addEventListener('message', (message) => {
        console.log('message received');
        counter++;
        if (counter == 2){
          resolve();
        }
      });

      client2.addEventListener('message', (message) => {
        console.log('message received');
        counter++;
        if (counter == 2){
          resolve();
        }
      });

  });
  await promise;
  expect(counter).toBe(2);

  client2.close();
})

test('Client receives correct WebSocket message', async () => {
  const message1 = {
    messageBody: "abc",
    messageType: 1
  }
  let receivedMessage;

  ws.on('connection', async (connection, req) => {
    console.log("websocket sent message")
    connection.send(JSON.stringify(message1));
  });

  const promise = new Promise((resolve) => {

    client1.addEventListener('message', (message) => {
      console.log('message received');
      receivedMessage = JSON.parse(message.data);
      resolve();
    });
  })

  await promise;
  expect(receivedMessage).toStrictEqual(message1);

})

})

describe('WebSocket identifies unique connections', () => {

  const wss = require('../controllers/notificationServerController').wss;
  const clients = require('../controllers/notificationServerController').clients;

  test('WebSocket server can store unique client connection', async () => {
    const clientABC = new WebSocket('ws://localhost:8080?uuid=ABC');

    //wait some time for client to connect
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const clientPresent = clients.has('ABC');
    expect(clientPresent).toBe(true);

    clientABC.close();
    wss.close();
    await new Promise((resolve) => setTimeout(resolve, 100));
  })
})

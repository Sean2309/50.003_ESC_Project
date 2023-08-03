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
  const url = "ws://localhost:8081"

  beforeEach(() => {
    ws = new WebSocket.Server({ port: 8081 });
    client1 = new WebSocket(url);
  });

  afterEach(() => {
    // Close the WebSocket connection after each test
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
})

test('Client receives correct WebSocket message', async () => {
  const message1 = {
    messageBody: "abc",
    messageType: 1
  }
  let counter = 0;
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

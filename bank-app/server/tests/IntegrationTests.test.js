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

describe("WebSocket Server", () => {
    let ws;
    const url = "ws://localhost:8081";
    let client1;

    beforeAll(async () => {
      ws = new WebSocket.Server({ port: 8081 });
      console.log("beforeAll")
      client1 = new WebSocket(url);
    });

    afterAll(() => {
      ws.close();
      console.log("afterall")
    });

  test('WebSocket server is connected to client ', async () => {
    const message1 = "test";
    let counter = 0;

      ws.on('connection', async (connection, req) => {
        console.log("websocket sent message")
        connection.send(message1);
      });

      const promise = new Promise((resolve) => {
        client1.addEventListener('message', (message) => {
          console.log("client received message");
          counter++;
          resolve();
      });
      });

      await promise;

      expect(counter).toBe(1);
  })

  test('WebSocket server is connected to client ', async () => {
    const message1 = "test";
    const client2 = new
    let counter = 0;

      ws.on('connection', async (connection, req) => {
        console.log("websocket sent message")
        connection.send(message1);
      });

      const promise = new Promise((resolve) => {
        client1.addEventListener('message', (message) => {
          console.log("client received message");
          counter++;
          resolve();
      });
      });

      await promise;

      expect(counter).toBe(1);
  })

 



})

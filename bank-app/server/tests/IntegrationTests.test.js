/*
things to test:
WebSocket connection
WebSocket sending
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

  beforeEach(() => {
    const ws = new WebSocket.Server({ port: 8080 });
  });

  afterEach(() => {
    // Close the WebSocket connection after each test
    ws.close();
  });

  test('WebSocket server should echo messages back to the client', (done) => {
    const message = 'Hello, WebSocket!';
    
    ws.onopen = () => {
      ws.send(message);
    };

    ws.onmessage = (event) => {
      expect(event.data).toBe(message);
      done();
    };
  });

  test('WebSocket server should handle multiple clients', (done) => {
    const client1 = new WebSocket('ws://localhost:8080');
    const client2 = new WebSocket('ws://localhost:8080');
    const message1 = 'Message from client 1';
    const message2 = 'Message from client 2';

    let count = 0;

    const checkDone = () => {
      count++;
      if (count === 2) {
        done();
      }
    };

    client1.onopen = () => {
      client1.send(message1);
    };

    client1.onmessage = (event) => {
      expect(event.data).toBe(message1);
      checkDone();
    };

    client2.onopen = () => {
      client2.send(message2);
    };

    client2.onmessage = (event) => {
      expect(event.data).toBe(message2);
      checkDone();
    };
  });

  // Add more test cases as needed
});

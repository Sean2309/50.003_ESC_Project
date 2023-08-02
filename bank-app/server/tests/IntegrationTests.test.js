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
        connection.send(message1);
      })
    });

    client1.addEventListener('message', (event) => {
      const message = event.data;
      expect(message).toBe(message1);
     });
  })
  
  test('WebSocket server can handle multiple clients', async () => {
    const client1 = new WebSocket('ws://localhost:8081');
    const client2 = new WebSocket('ws://localhost:8081');
    const message1 = 'Message from client 1';
    const message2 = 'Message from client 2';
    
    const mockfn = jest.fn();

    ws.on('connection', async (connection, req) => {
      connection.on('message', (message) => {
        console.log("hi im called");
        mockfn();
    })});

    const promise = new Promise((resolve) => {
      let counter = 0;
  
      client1.addEventListener('open', () => {
        client1.send(message1);
        counter++;
        if (counter === 2) resolve();
      });
  
      client2.addEventListener('open', () => {
        client2.send(message2);
        counter++;
        if (counter === 2) resolve();
      });
    });

    await promise;

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockfn).toHaveBeenCalledTimes(2);
});

test('WebSocket client can send messsage to server', () => {
  const message1 = 'Hello, WebSocket!';
  
  ws.on('connection', async (connection, req) => {
    connection.on('message', (message) => {
    expect(message),toBe(message1);
  })});

  client1.addEventListener('open', () => {
      client1.send(message1);
    });
})

})

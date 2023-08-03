const WebSocket = require('ws');
const membershipId = '1230oij'

//edit test after integration to use membershipID
 // ============ test WebSocket connecton ============= // 
 describe ('Unit tests for WebSocket', () => {
    let client;
  
    beforeAll((done) => {
  
      // Create and connect the WebSocket client
      const url = 'ws://localhost:8080?uuid=' + membershipId;
      const client = new WebSocket(url);
      client.open(done);
    });

    afterAll(() => {
      // Close the WebSocket client after the tests
      client.close();
    });

    test('WebSocket is connected', async () => {

        //jest.replaceProperty(WebSocket, 'OPEN', true)
        const logSpy = await jest.spyOn(global.console, 'log');


        expect(logSpy.mock.calls).toHaveBeenCalledWith('WebSocket connection established')

    })})

const axiosMock = {
    __esModule: true,
    get: jest.fn((url) => {
      if (url === 'http://localhost:3001/api/loyaltyPrograms') {
        return Promise.resolve({ data: { loyaltyPrograms: [] } });
      } else if (url === 'http://localhost:3001/api/userprofile') {
        return Promise.resolve({ data: {} });
      }
      // Return a rejected promise for other URLs
      return Promise.reject(new Error('Not found'));
    }),
  };
  
  export default axiosMock;
  
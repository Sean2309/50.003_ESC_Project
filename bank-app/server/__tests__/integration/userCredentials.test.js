const mongoose = require('mongoose');
const UserCredentials = require('../../models/userCredentials');
const config = require('../../utils/config');

describe('UserCredentials Model Test', () => {
    let savedUser;
  
    beforeAll(async () => {
        mongoose.connect(config.MONGODB_URL).then((res) => console.log('connected')).catch((err) => console.error('error'));
    });
  
    beforeEach(async () => {
      const userCredentials = new UserCredentials({
        loginId: 'test',
        password: 'password',
        userId: '1',
      });
  
      savedUser = await userCredentials.save();
    });
  
    it('should hash user password before saving to database', async () => {
      expect(savedUser.password).not.toBe('password');
    });
  
    it('should compare hashed password with a plain text password', async () => {
      const result = await savedUser.comparePassword('password');
      expect(result).toBe(true);
    });
  
    afterEach(async () => {
      await UserCredentials.deleteMany({});
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  });
  
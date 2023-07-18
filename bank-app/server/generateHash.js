const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const passwordToHash = 'mypass123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordToHash, saltRounds);
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();


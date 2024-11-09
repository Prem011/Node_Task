// utils/bcrypt.js
const bcrypt = require('bcrypt');

const saltRounds = 10; // You can change this if needed


// const hashPassword = async (password) => {
//     return bcrypt.hash(password, 10);
// };

// const hashPassword = async (password) => {
//   try {
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     return hashedPassword;
//   } catch (error) {
//     throw new Error('Error hashing password');
//   }
// };

const hashPassword = async (password) => {
    try {
      // Ensure that the password is provided
      if (!password) {
        throw new Error('Password is required');
      }
  
      // Hash the password with 10 rounds of salt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      // Log the error to help with debugging
      console.error('Error hashing password:', error);
      throw new Error('Error hashing password');
    }
  };

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch; // Returns true if passwords match, false otherwise
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = {
    hashPassword,
    comparePassword,
};



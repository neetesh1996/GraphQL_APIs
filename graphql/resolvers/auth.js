const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const {user} =require('./merge')

module.exports = {
    users: async (args) => {
        
      try {
        const users = await User.find();
        return users.map(event => {
          return user(event);
        });
      } catch (err) {
        throw err;
      }
    },
    
  
  
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email,password}) =>{
      const user = await User.findOne({ email: email});
      if(!user){
          throw new Error("User not found");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      console.log(isEqual)
      if (!isEqual){
          throw new Error('Password is Incorrect');
      }
    const token =  jwt.sign(
          {userId: user.id, email: user.email},
          'somesupersecretekey',
          {
          expiresIn:'3h'
      });
      return {userId: user.id, token:token,tokenExpiration:3 };
  }
}
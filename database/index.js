const mongoose = require('mongoose');
const connection = mongoose.createConnection(process.env.DB || 'mongodb://localhost/mvp');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  session_token: {type: String, required: false}, // consider local storage
});

const User = connection.model('User', userSchema);

const save = (email, sessionToken) => {
  const user = {
    email: email,
    session_token: sessionToken,
  };

  return new Promise((resolve, reject) => {
    new User(user).save((err, res, suc) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const find = (email) => {
  return new Promise((resolve, reject) => {
    User.find({email: email}).exec((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

module.exports.save = save;
module.exports.find = find;


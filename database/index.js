const mongoose = require('mongoose');
const connection = mongoose.createConnection(process.env.DB || 'mongodb://localhost/mvp');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  session_token: {type: String, required: true}, // most recent
  prefs: {
    mon: {
      restaurant: {type: String, required: false},
      time: {type: String, required: false},
      objectId: {type: mongoose.Schema.Types.Mixed, required: false},
    },
    tues: {
      restaurant: {type: String, required: false},
      time: {type: String, required: false},
      objectId: {type: mongoose.Schema.Types.Mixed, required: false},
    },
    wednes: {
      restaurant: {type: String, required: false},
      time: {type: String, required: false},
      objectId: {type: mongoose.Schema.Types.Mixed, required: false},
    },
    thurs: {
      restaurant: {type: String, required: false},
      time: {type: String, required: false},
      objectId: {type: mongoose.Schema.Types.Mixed, required: false},
    },
    fri: {
      restaurant: {type: String, required: false},
      time: {type: String, required: false},
      objectId: {type: mongoose.Schema.Types.Mixed, required: false},
    },
  },
});

const sessionSchema = mongoose.Schema({
  session_token: {type: String, required: true, unique: true},
  email: {type: String, required: true},
});

const User = connection.model('User', userSchema);
const Session = connection.model('Session', sessionSchema);

const save = (email, sessionToken) => {
  const session = {
    session_token: sessionToken,
    email: email,
  };

  return new Promise((resolve, reject) => {
    new Session(session).save((saveErr) => {
      if (saveErr) reject(saveErr);
      else {
        const q = {email: email};
        const update = {session_token: sessionToken};
        const options = {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        };
        User.findOneAndUpdate(q, update, options, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      }
    });
  });
};

const update = (sessionToken, prefs) => {
  return new Promise((resolve, reject) => {
    Session.find({session_token: sessionToken}).exec((findErr, res) => {
      if (findErr) reject(findErr);
      else {
        // console.log(res);
        const q = {email: res[0].email};
        const update = {
          session_token: sessionToken,
          prefs: prefs,
        };
        User.findOneAndUpdate(q, update, {}, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      }
    });
  });
};

const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({}).exec((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

module.exports.save = save;
module.exports.update = update;
module.exports.fetchUsers = fetchUsers;


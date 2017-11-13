require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const moment = require('moment');

const db = require('./database');
const mp = require('./helpers/mp');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.post('/login', (req, res) => {
  mp.login(req.body.email, req.body.password).then((data) => {
    // console.log('Got a response!', data);
    db.save(req.body.email, data.data.sessionToken.slice(2)).then((result) => {
      // console.log('DB save:', result);
      res.statusCode = 200;
      res.send(data.data);
    
    }).catch((err) => {
      console.log('Error saving to db in POST /login:', err);
      res.statusCode = 404;
      res.send(err.data);
    });

  }).catch((err) => {
    console.log('Error POST /login:', err);
    res.statusCode = 404;
    res.send(err.data);
  });
});

app.get('/lunch', (req, res) => {
  console.log(req.body);
  const cityId = req.body.cityId || '00000000-1000-4000-9091-919aa43e4747';
  mp.fetchMeals(cityId).then((data) => {
    // console.log('Got food!', data);
    res.statusCode = 200;
    res.send(data.data.result.map((entry) => {
      return {
        date: entry.date.iso,
        meal: entry.meal.name,
        restaurant: entry.restaurant.name,
        address: entry.restaurant.address,
        mpnLunchOpen: entry.restaurant.mpnLunchOpen,
        mpnLunchClose: entry.restaurant.mpnLunchClose,
        objectId: entry.objectId,
      };
    }));
    
  }).catch((err) => {
    console.log('Error GET /lunch:', err);
    res.statusCode = 404;
    res.send(err.data);
  });
});

app.post('/lunch', (req, res) => {
  console.log('Got /lunch POST', req.body);
  db.update(req.body.session_token, req.body.prefs).then((data) => {
    console.log('Got update', data);

  }).catch((err) => {
    console.log('Error POST /lunch:', err.data);
  });
});

app.get('/', (req, res) => {
  // maybe check for session_token/cookie
  res.redirect(302, '/login');
});

const port = process.env.PORT || '6969';
app.set('port', port);

const days = ['sun', 'mon', 'tues', 'wednes', 'thurs', 'fri', 'sat'];
const frequency = process.env.FREQUENCY || 15000; // 15 seconds default

const snipe = () => {
  db.fetchUsers().then((data) => {
    const day = days[moment().day()+1];
    // console.log(data,day);

    data.forEach((user) => {
      if (user.prefs[day].objectId) {
        mp.reserve(user.session_token, user.prefs[day].objectId, user.prefs[day].time).then((data) => {
          console.log('Success reserving', user.email);
        
        }).catch((err) => {
          console.log('Error reserving', err.response.data);
        });
      }
    });
    
  }).catch((err) => {
    console.log('Bad DB fetch while sniping', err.data);
  });
};


const sleeping = () => {
  if (moment().day() < 5) {
    const timeout = moment();
    // setTimeout(snipe, timeout);

  } else {
    // 24hr - currHr + 16 hr ~= tmr at 4'ish
    const timeout = (40 - moment().get('hour')) * 3600000;
    setTimeout(sleeping, timeout);
  }
};

// const server = http.createServer(app);
app.listen(port, () => {
  console.log(`listening on port ${port}`)
  // sleeping();
  snipe();
});


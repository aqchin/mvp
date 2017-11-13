require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const moment = require('moment');

const db = require('./../database');
const mp = require('./../helpers/mp');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
  const cityId = req.body.cityId || '00000000-1000-4000-9091-919aa43e4747'; // sf
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

app.post('/lunch/reserve', (req, res) => {
  console.log('Got /lunch/reserve POST', req.body);
  db.update(req.body.session_token, req.body.prefs).then((data) => {
    // console.log('Got update', data);
    const offset = (moment().get('hour') >= 17) ? 1 : 0;
    const day = days[moment().day() + offset];
    const prefs = req.body.prefs[day];

    if (prefs) {
      mp.reserve(req.body.session_token, prefs.objectId, prefs.time).then((data) => {
        console.log('Success reserving for tomorrow!');
        res.statusCode = 201;
        res.send();
      
      }).catch((err) => {
        console.log('Error reserving:', err.response.data);
        res.statusCode = 403;
        res.send(err.response.data);
      });
    }

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
const attemptFrequency = process.env.ATTEMPT_FREQUENCY || 15000; // 15 seconds default
const attemptCount = process.env.ATTEMPT_COUNT || 5;

const reserveAll = () => {
  db.fetchUsers().then((data) => {
    const offset = (moment().get('hour') >= 17) ? 1 : 0;
    const day = days[moment().day() + offset];
    // console.log(data, day); 
    
    // TODO: add retry functionality
    data.forEach((user) => {
      if (user.prefs && user.prefs[day].objectId) {
        const prefs = user.prefs[day];
        mp.reserve(user.session_token, prefs.objectId, prefs.time).then((data) => {
          console.log('Success reserving for:', user.email);
        
        }).catch((err) => {
          console.log('Error reserving:', err.response.data);
        });
      }
    });
    
  }).catch((err) => {
    console.log('Error fetching DB:', err.data);
  });

  // 24hr - currHr + 16 hr ~= tmr at 4pm'ish
  const timeout = (40 - moment().get('hour')) * 3600000;
  console.log(`[${moment().format('HH:mm:ss')}] Sleeping for ${timeout}ms...`);
  setTimeout(reservationLoop, timeout);
};

const reservationLoop = () => {
  const day = moment().day();
  if (day < 6) {
    const hour = moment().get('hour');
    // reservation hours are 5pm-9:30am, starting previous day
    if (day === 0 && hour >= 17 ||
        day === 5 && hour <= 9 ||
        day > 0 && day < 5 && (hour >=17 || hour <= 9)) {
      reserveAll();
    
    } else {
      const openTime = moment().set({
        hour: '17',
        minute: '00',
        second: '00'
      }).format('H:mm:ss');
      const timeout = openTime.diff(moment()); // should default to ms

      setTimeout(reserveAll, Math.max(0, timeout));
    }

  } else {
    // 24hr - currHr + 16 hr ~= tmr at 4pm'ish
    const timeout = (40 - moment().get('hour')) * 3600000;
    console.log(`[${moment().format('HH:mm:ss')}] Sleeping for ${timeout}ms...`);
    setTimeout(reservationLoop, timeout);
  }
};

app.listen(port, () => {
  console.log(`listening on port ${port}`)
  reservationLoop();
});


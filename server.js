require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

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
  console.log(req.body);
  mp.login(req.body.email, req.body.password).then((data) => {
    console.log('Got a response!', data);
    res.statusCode = 200;
    res.send(data.data);

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

});

app.get('/', (req, res) => {
  // check for session_token/cookie
  res.redirect(302, '/login');
});

const port = process.env.PORT || '6969';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {console.log(`listening on port ${port}`)});


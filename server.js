require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

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
  mp.login(req.body.email, req.body.password).then((res) => {
    console.log('Got a response!', res);

  }).catch((err) => {
    console.log('Error POST /login:', err);
  });
});

app.get('/lunch', (req, res) => {

});

app.post('/lunch', (req, res) => {

});

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'dist/index.html'));
  res.redirect(302, '/login');
});

const port = process.env.PORT || '6969';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {console.log(`listening on port ${port}`)});


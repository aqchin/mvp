const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const login = require('./server/routes/login');
// const lunch = require('./server/routes/lunch');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/login', login);
// app.use('/lunch', lunch);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '6969';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {console.log(`listening on port ${port}`)});


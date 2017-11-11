const axios = require('axios');

const url = `https://secure.${process.env.DOMAIN}/1/login`;
const config = {
  headers: {
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'Host': `secure.${process.env.DOMAIN}`,
    'Origin': `https://secure.${process.env.DOMAIN}`,
    'Referer': `https://secure.${process.env.DOMAIN}/login`,
    'User-Agent': process.env.USER_AGENT,
  },
};

const login = (email, password) => { // login is email
  const data = {
    'email': email,
    'password': password,
  };

  return axios.post(url, data, config); // promise
  // .then((res) => {
  //   console.log('Response', res);
  // }).catch((err) => {
  //   console.log('Error', err);
  // });
};

module.exports.login = login;


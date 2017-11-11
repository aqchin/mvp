const axios = require('axios');

const login = (email, password) => { // login is an email
  const options = {
    url: `https://secure.${process.env.MP}/1/login`,
    headers: {
      'Accept': 'application/json',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json;charset=UTF-8',
      'Host': `secure.${process.env.MP}`,
      'Origin': `https://secure.${process.env.MP}`,
      'Referer': `https://secure.${process.env.MP}/login`,
      'User-Agent': process.env.USER_AGENT,
    },
  };

  return axios.post(``, options);
};


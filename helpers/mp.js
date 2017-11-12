const axios = require('axios');

const origin = `https://secure.${process.env.DOMAIN}`;

const loginUrl = `${origin}/1/login`;
const getByCityUrl = `${origin}/1/functions/getByCity`;
const reservationsUrl = `${origin}/api/v2/reservations`;

const config = {
  headers: {
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'Host': `secure.${process.env.DOMAIN}`,
    'Origin': origin,
    'Referer': `${origin}/login`,
    'User-Agent': process.env.USER_AGENT,
  },
};

const login = (email, password) => { // login is email
  const data = {
    'email': email,
    'password': password,
  };

  return axios.post(loginUrl, data, config); // promise
};

const fetchMeals = (cityId) => {
  const data = {
    'cityId': cityId,
  };

  return axios.post(getByCityUrl, data, config);
};

const reserve = (sessionToken, scheduleId, pickupTime='12:45-1:00pm', quantity=1) => {
  const data = {
    'pickup_time': pickupTime,
    'quantity': quantity,
    'schedule_id': scheduleId,
    'source': 'web',
  };

  const reserveCfg = Object.assign({
    'Cookie': `_mealpal_session=${sessionToken}; isLoggedIn=true;`,
  }, config);
};

module.exports.login = login;
module.exports.fetchMeals = fetchMeals;
module.exports.reserve = reserve;


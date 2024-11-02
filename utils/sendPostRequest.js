// utils/sendPostRequest.js

const axios = require('axios');

async function sendPostRequest(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = sendPostRequest;

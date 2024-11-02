// utils/sendPutRequest.js

const axios = require('axios');

async function sendPutRequest(url, data) {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = sendPutRequest;

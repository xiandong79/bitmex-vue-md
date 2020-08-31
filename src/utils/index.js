import config from '../config'

const axios = require('axios')
const crypto = require('crypto')

function apiAuthRequest (method = 'POST', url, data = '') {
  const path = '/api/v1' + url
  const expires = Math.round(new Date().getTime() / 1000) + 60
  const postBody = data ? JSON.stringify(data) : data
  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': config.apiKey,
    'api-signature': crypto
      .createHmac('sha256', config.apiSecret)
      .update(method + path + expires + postBody)
      .digest('hex')
  }
  const requestOptions = {
    headers: headers,
    url: config.apiUrl + url,
    method: method,
    data: postBody
  }

  return axios(requestOptions)
}

export { apiAuthRequest }

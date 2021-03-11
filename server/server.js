const express = require('express');
const cookieParser = require('cookie-parser');
const queryString = require('querystring');
const { getRandomString } = require('./utils/auth.js');

const app = express();
const PORT = '3000';

app.use(cookieParser());

app.get('/', (req, res, next) => {
  res.json({ message: 'YO!' });
});

app.get('/login', (req, res, next) => {
  const state = getRandomString();
  res.cookie('spotify_auth_state', state);
  const scope =
    'user-read-currently-playing streaming playlist-modify-public user-read-email';

  res.redirect(
    `https://accounts.spotify.com/authorize?${queryString.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope,
      redirect_uri: process.env.REDIRECT_URI,
      state,
    })}`
  );
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

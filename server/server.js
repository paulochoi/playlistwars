const express = require('express');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const request = require('request'); // "Request" library
const cors = require('cors');
const models = require('./models/playlistModels');
require('dotenv').config();

const { generateRandomString } = require('./utils/auth.js');

const app = express();
const PORT = '3000';
const STATE_KEY = 'spotify_auth_state';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'YO!' });
  console.log('clientit', process.env.CLIENT_ID);
});

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  console.log(STATE_KEY, state);
  res.cookie(STATE_KEY, state);
  const scope =
    'user-read-currently-playing streaming playlist-modify-public playlist-read-private playlist-read-collaborative user-read-email user-read-private';

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope,
      redirect_uri: process.env.REDIRECT_URI,
      state,
    })}`
  );
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log('hittin callback?');
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  if (state === null || state !== storedState) {
    res.redirect(
      `/#${querystring.stringify({
        error: 'state_mismatch',
      })}`
    );
  } else {
    res.clearCookie(STATE_KEY);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      json: true,
    };

    console.log(authOptions);

    request.post(authOptions, (error, response, body) => {
      console.log(body);
      const { access_token } = body;
      const uri = process.env.FRONTEND_URI || 'http://localhost:8080';
      res.redirect(uri + '?access_token=' + access_token);
    });
  }
});

app.post('/checkPlaylist', async (req, res) => {
  // console.log('BODY IS', req.body);
  console.log('inside checkplaylist');
  console.log({ name: req.body.name });
  const result = await models.Playlist.findOne({ name: req.body.name });
  if (!result) {
    const created = await models.Playlist.create(req.body);
    // console.log('CREATED', created);
    return res.json(created);
  }
  console.log('FOUND', result);
  return res.json(result);
  // console.log('FOUND', found);
});

app.post('/upvoteSong', async (req, res) => {
  const { playlist, name } = req.body;
  console.log(playlist, name);
  const found = await models.Playlist.findOne({ name: playlist });

  found.tracks.map((track) =>
    track.trackName === name ? (track.votes += 1) : null
  );
  const updated = await found.save();
  res.json({ data: 'OK' });
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

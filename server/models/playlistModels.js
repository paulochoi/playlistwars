const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://makwanza:kicks@cluster0.jndi3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'starwars',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  uri: String,
  track: String,
  track_id: {
    type: Schema.Types.ObjectId,
    ref: 'track',
  },
});
const Playlist = mongoose.model('playlist', playlistSchema);

const trackSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  spotify_id: String,
  votes: Number,
});

const Track = mongoose.model('track', trackSchema);

module.exports = {
  Playlist,
  Track,
};

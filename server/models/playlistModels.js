const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://makwanza:kicks@cluster0.jndi3.mongodb.net/playlistWars?retryWrites=true&w=majority';

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    // dbName: 'playlistWars',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log('MONGOOSE EROR', err));

console.log(mongoose.connection.readyState);

const { Schema } = mongoose;

const playlistSchema = new Schema({
  name: String,
  tracks: [
    {
      trackName: String,
      votes: { type: Number, default: 0 },
    },
  ],
});
const Playlist = mongoose.model('playlist', playlistSchema);

module.exports = {
  Playlist,
};

const setupPlayer = (authToken) => {
  return new Promise((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = authToken;
      const player = new Spotify.Player({
        name: "Playlist Wars",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
        reject(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
        reject(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
        reject(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
        reject(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        console.log(state);
        resolve({ status: "changed", device_id: null });
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        resolve({ status: "ready", device_id, instance: player });
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect();
    };
  });
};

export { setupPlayer };

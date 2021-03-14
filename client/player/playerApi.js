const playSong = (deviceID, uri, loginState) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
      method: "PUT",
      body: JSON.stringify({
        uris: [uri],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginState}`,
      },
    }).then((a) => {
      resolve(a);
    });
  });
};

const getVolume = (player) => {
  player.getVolume().then((volume) => {
    let volume_percentage = volume * 100;
    console.log(`The volume of the player is ${volume_percentage}%`);
  });
};

const getCurrentState = async (player) => {
  const state = await player.getCurrentState();
  return new Promise((resolve, reject) => {
    console.log("state is", state);
    if (!state) {
      console.log("User is not playing music through the player sdk");
      return;
    }
    let {
      current_track,
      next_tracks: [next_track],
    } = state.track_window;
    console.log("Playing", current_track);
    console.log("Playing next", next_track);
    resolve(current_track);
  });
};

export { playSong, getCurrentState, getVolume };

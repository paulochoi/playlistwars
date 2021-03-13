const getPlaylists = (loginState) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + loginState },
    })
      .then((response) => response.json())
      .then((playlistData) => {
        console.log(playlistData);
        resolve(playlistData);
      });
  });
};

const getUserInfo = (loginState) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + loginState },
    })
      .then((response) => response.json())
      .then((val) => {
        console.log(val);
        resolve(val);
      })
      .catch(() => console.log);
  });
};

export { getPlaylists, getUserInfo };

const getPlaylists = (loginState) => {
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: "Bearer " + loginState },
  })
    .then((response) => response.json())
    .then((playlistData) => {
      console.log(playlistData);
    });
};

const getUserInfo = (loginState) => {
  fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: "Bearer " + loginState },
  })
    .then((response) => response.json())
    .then((val) => {
      setUser(val);
    })
    .catch(() => console.log);
};

export { getPlaylists, getUserInfo };

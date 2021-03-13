import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import queryString from "query-string";
import { setupPlayer } from "../../player/player.js";

const url = "http://localhost:3000";
const Login = () => {
  const [user, setUser] = useState({});
  useEffect(async () => {
    const parsed = queryString.parse(window.location.search);
    const loginState = parsed.access_token;
    if (loginState) {
      const deviceID = await setupPlayer(loginState);
      console.log(deviceID);

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: "PUT",
        body: JSON.stringify({
          uris: ["spotify:track:7xGfFoTpQ2E7fRF5lN10tr"],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginState}`,
        },
      }).then((a) => console.log(a));

      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + loginState },
      })
        .then((response) => response.json())
        .then((val) => {
          setUser(val);
        })
        .catch(() => console.log);

      fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: "Bearer " + loginState },
      })
        .then((response) => response.json())
        .then((playlistData) => {
          console.log(playlistData);
        });
    }
  }, []);
  return (
    <>
      <Button
        variant="primary"
        onClick={() => (window.location = `${url}/login`)}
      >
        Primary
      </Button>
      {user.display_name}
    </>
  );
};

export default Login;

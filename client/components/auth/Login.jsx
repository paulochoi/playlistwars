import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import queryString from "query-string";
import { setupPlayer } from "../../player/player.js";
import * as Player from "../../player/playerAPI.js";
import * as SpotifyAPI from "../../player/webApi.js";

const url = "http://localhost:3000";
const Login = () => {
  const [user, setUser] = useState({});
  useEffect(async () => {
    const parsed = queryString.parse(window.location.search);
    const loginState = parsed.access_token;
    if (loginState) {
      const { status, device_id, instance } = await setupPlayer(loginState);
      SpotifyAPI.getPlaylists(loginState);
      if (status === "ready") {
        // await Player.playSong(
        //   device_id,
        //   "spotify:playlist:37i9dQZF1DWWwaxRea1LWS",
        //   loginState
        // );
        // console.log("instance on login", instance);
        // Player.getCurrentState(instance);
        // Player.getVolume(instance);
      }

      console.log(device_id);
    }
  });

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

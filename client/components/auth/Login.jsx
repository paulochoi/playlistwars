import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import queryString from "query-string";
import Jumbotron from "react-bootstrap/Jumbotron";
import { setupPlayer } from "../../player/player.js";
import * as Player from "../../player/playerAPI.js";
import * as SpotifyAPI from "../../player/webApi.js";
import MainContainer from "../mainApp/MainContainer.jsx";

const url = "http://localhost:3000";
const Login = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loggedOn, setLoggedOn] = useState(false);
  useEffect(async () => {
    const parsed = queryString.parse(window.location.search);
    if (Object.entries(parsed).length > 0) setLoggedOn(true);
    const loginState = parsed.access_token;
    if (loginState) {
      const { status, device_id, instance } = await setupPlayer(loginState);
      SpotifyAPI.getPlaylists(loginState);
      const user = await SpotifyAPI.getUserInfo(loginState);
      const { display_name, email, images } = user;
      setName(display_name);
      setImage(images[0].url);
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
    }
  });

  return (
    <Container>
      {!loggedOn ? (
        <>
          <br></br>
          <Row>
            <Col md lg="2"></Col>
            <Col>
              <Jumbotron bg="dark" variant="dark">
                <h1>PLAYLIST WARS</h1>
                <p>
                  Vote on your favorite song. The most upvoted song will be
                  played next!
                </p>
                <p>
                  <Button
                    variant="success"
                    onClick={() => {
                      window.location = `${url}/login`;
                      setLoggedOn(true);
                    }}
                  >
                    Login with Spotify
                  </Button>
                </p>
              </Jumbotron>
            </Col>
            <Col md lg="2"></Col>
          </Row>
        </>
      ) : (
        <MainContainer name={name} image={image} />
      )}
    </Container>
  );
};

export default Login;

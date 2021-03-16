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
import BsMusicPlayerFill from "react-icons/bs";

const url = "http://localhost:3000";
const Login = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [loggedOn, setLoggedOn] = useState(false);
  const [loginState, setLoginState] = useState();
  const [playerInstance, setPlayerInstance] = useState({});
  const [clientID, setClientID] = useState();
  useEffect(async () => {
    const parsed = queryString.parse(window.location.search);
    if (Object.entries(parsed).length > 0) setLoggedOn(true);
    setLoginState(parsed.access_token);
    if (loginState) {
      const { status, device_id, instance } = await setupPlayer(loginState);
      setPlayerInstance(instance);
      setClientID(device_id);
      SpotifyAPI.getPlaylists(loginState);
      const user = await SpotifyAPI.getUserInfo(loginState);
      const playlists = await SpotifyAPI.getPlaylists(loginState);
      console.log(playlists.items);
      setPlaylists(playlists.items);
      const { display_name, email, images } = user;
      setName(display_name);
      setImage(images[0].url);
      // if (status === "ready") {
      //   // await Player.playSong(
      //   //   device_id,
      //   //   "spotify:track:1LNroGH4W4RsUVjIFUsrUA",
      //   //   loginState
      //   // );
      //   // console.log("instance on login", instance);
      //   Player.getCurrentState(instance);
      //   Player.getVolume(instance);
      // }
    }
  }, [loginState]);

  return (
    <Container fluid>
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
                    variant="danger"
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
        <MainContainer
          name={name}
          image={image}
          playLists={playlists}
          loginState={loginState}
          clientID={clientID}
          playerInstance={playerInstance}
        />
      )}
    </Container>
  );
};

export default Login;

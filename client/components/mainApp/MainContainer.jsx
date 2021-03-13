import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Select from "react-select";
// import { setupPlayer } from "../../player/player.js";
import * as SpotifyAPI from "../../player/webApi.js";
import * as Player from "../../player/playerAPI.js";

const MainContainer = ({
  name,
  image,
  playLists,
  loginState,
  playerInstance,
  clientID,
}) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  useEffect(async () => {
    const tempOptions = [];
    if (playLists && playLists.length > 0) {
      console.log("LOGINSTATE", loginState);
      // const { status, device_id, instance } = await setupPlayer(loginState);
      //setDeviceID(device_id);
      console.log("Loaded Playlist");
      console.log(playLists);
      for (const p of playLists) {
        if (p.images[2]) {
          tempOptions.push({
            value: p.id,
            label: (
              <span>
                <img
                  src={p.images[2].url}
                  width="25"
                  height="25"
                  style={{ padding: "3px" }}
                ></img>
                {p.name}
              </span>
            ),
          });
        }
      }
      setOptions(tempOptions);
    } else {
      console.log("Not Loaded");
    }
  }, [playLists]);

  const playlistSelected = async (e) => {
    console.log(e.label.props.children[1]);
    setSelected(e.label.props.children[1]);
    console.log(e.value);
    const tracks = await SpotifyAPI.getPlaylistTracks(loginState, e.value);
    console.log(tracks);
    await Player.playSong(clientID, tracks.items[0].track.uri, loginState);
    console.log("instance on login", playerInstance);
    Player.getCurrentState(playerInstance);
    Player.getVolume(playerInstance);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>PLAYLIST WARS</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {image ? (
            <>
              <span style={{ width: "300px" }}>
                <Select
                  options={options}
                  defaultValue={{ label: "Select your Playlist", value: 0 }}
                  onChange={playlistSelected}
                />
              </span>
              <Navbar.Text className="p-2">
                Signed in as: <a href="#login">{name}</a>
              </Navbar.Text>
              <Navbar.Brand href="#home">
                <img
                  src={image}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Navbar.Brand>
            </>
          ) : (
            ""
          )}
        </Navbar.Collapse>
      </Navbar>

      <Navbar bg="dark" variant="dark" fixed="bottom">
        <Navbar.Brand>PLAYLIST WARS</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Current Playlist: <a href="#login">{selected}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MainContainer;

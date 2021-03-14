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
  const [playing, setPlaying] = useState();
  const [trackLength, setTrackLength] = useState("0:00");
  const [currentTrackTime, setCurrentTrackTime] = useState("0:00");
  const [playlistTracks, setPlaylistTracks] = useState();
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
    // Set a fake timeout to get the highest timeout id
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    console.log(e.value);
    let interval = 0;
    const tracks = await SpotifyAPI.getPlaylistTracks(loginState, e.value);
    console.log(tracks);
    setPlaylistTracks(tracks);
    await Player.playSong(clientID, tracks.items[0].track.uri, loginState);
    const currentTrack = await Player.getCurrentState(playerInstance);
    setPlaying(currentTrack);
    console.log("CURRENT TRACK", currentTrack);
    setTrackLength(
      Math.floor(currentTrack.duration_ms / 1000 / 60) +
        ":" +
        ((currentTrack.duration_ms / 1000) % 60
          ? Math.round((currentTrack.duration_ms / 1000) % 60)
          : "00")
    );
    setInterval(() => {
      interval += 1000;
      setCurrentTrackTime(
        Math.floor(interval / 1000 / 60) +
          ":" +
          ((interval / 1000) % 60 ? Math.round((interval / 1000) % 60) : "00")
      );
    }, 1000);
    console.log("Playing=====", playing);
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
        {playing ? (
          <>
            <Navbar.Brand href="#home" className="p-1">
              <img
                src={playing.album.images[1].url}
                width="30"
                height="30"
              ></img>
            </Navbar.Brand>
            <Navbar.Text>
              {playing.artists[0].name} - {playing.name} - {trackLength} -{" "}
              {currentTrackTime}
            </Navbar.Text>
          </>
        ) : null}
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {selected ? (
              <>
                Current Playlist: <a href="#login">{selected}</a>
              </>
            ) : null}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MainContainer;

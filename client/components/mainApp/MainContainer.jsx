import React, { useState, useEffect, useRef } from "react";
import Navbar from "react-bootstrap/Navbar";
import Select from "react-select";
// import { setupPlayer } from "../../player/player.js";
import * as SpotifyAPI from "../../player/webApi.js";
import * as Player from "../../player/playerAPI.js";
import Tracks from "./Tracks.jsx";
import { BsMusicPlayerFill } from "react-icons/bs";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";

const roundTime = (item) => {
  return +item < 10 ? `0${item}` : item;
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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
  const [playlistImage, setPlaylistImage] = useState();
  let nowPlaying = [];

  useEffect(async () => {
    const tempOptions = [];
    if (playLists && playLists.length > 0) {
      // console.log("LOGINSTATE", loginState);
      // const { status, device_id, instance } = await setupPlayer(loginState);
      //setDeviceID(device_id);
      // console.log("Loaded Playlist");
      // console.log(playLists);
      for (const p of playLists) {
        if (p.images[0]) {
          tempOptions.push({
            value: p.id,
            label: (
              <span>
                <img
                  src={p.images[0].url}
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
      // console.log("Not Loaded");
    }
  }, [playLists]);

  useEffect(async () => {
    // console.log("use effect playing", playing);
    if (selected && playlistTracks) {
      const creationAPIObj = {
        name: selected,
        tracks: playlistTracks.map((v) => {
          return {
            trackName: v.name,
            votes: 0,
          };
        }),
      };
    }
    console.log("FOR PLAYLIST", selected, playlistTracks);
    if (!playing && playlistTracks && playlistTracks.length > 0) {
      playTrack(playlistTracks);
    } else if (
      playlistTracks &&
      playlistTracks.length > 0 &&
      playing &&
      playing.name !== playlistTracks[0].name
    ) {
      // console.log("plyalisttracks changed", playlistTracks[0].id, playing.id);
      playTrack(playlistTracks);
    }
  }, [playlistTracks]);

  const playTrack = async (tracks) => {
    // console.log("calling playtrack");
    // Set a fake timeout to get the highest timeout id
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
    let interval = 0;
    // console.log("trying to play", tracks);
    await Player.playSong(clientID, tracks[0].uri, loginState);
    const currentTrack = await Player.getCurrentState(playerInstance);
    setPlaying(currentTrack);
    // console.log("CURRENT TRACK", currentTrack);
    Player.setVolume(playerInstance);
    Player.getVolume(playerInstance);
    setTrackLength(
      roundTime(Math.floor(currentTrack.duration_ms / 1000 / 60)) +
        ":" +
        ((currentTrack.duration_ms / 1000) % 60
          ? roundTime(Math.round(currentTrack.duration_ms / 1000) % 60)
          : "00")
    );
    setInterval(() => {
      interval += 1000;
      setCurrentTrackTime(
        roundTime(Math.floor(interval / 1000 / 60)) +
          ":" +
          ((interval / 1000) % 60
            ? roundTime(Math.round((interval / 1000) % 60))
            : "00")
      );
    }, 1000);
  };

  const playlistSelected = async (e) => {
    console.log("PROPS", e.label.props.children);
    setPlaylistImage(e.label.props.children[0].props.src);
    setSelected(e.label.props.children[1]);
    // console.log(e.value);
    let tracks = await SpotifyAPI.getPlaylistTracks(loginState, e.value);
    // console.log(tracks.items);
    const creationAPIObj = {
      name: e.label.props.children[1],
      tracks: tracks.items.map((v) => {
        return {
          trackName: v.track.name,
          votes: 0,
        };
      }),
    };

    const response = fetch("http://localhost:3000/checkPlaylist", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creationAPIObj),
    })
      .then((response) => response.json())
      .then((data) => {
        const tempObj = {};
        console.log("DATA IS", data);
        for (const d of data.tracks) {
          tempObj[d.trackName] = d.votes;
        }
        console.log("TEMPOBJ IS", tempObj);
        tracks = tracks.items.map((v) => ({
          ...v.track,
          votes: tempObj[v.track.name],
        }));
        tracks.sort((a, b) => b.votes - a.votes);
        setPlaylistTracks(tracks);
      });
  };

  const upvoted = (track, trackName) => {
    console.log("voted", track);
    playlistTracks.map((v) => (v.id === track ? (v.votes += 1) : null));
    playlistTracks.sort((a, b) => b.votes - a.votes);
    nowPlaying = playlistTracks[0];
    console.log(nowPlaying.name, selected);

    const response = fetch("http://localhost:3000/upvoteSong", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlist: selected, name: trackName }),
    });

    setPlaylistTracks([...playlistTracks]);
  };

  return (
    <>
      <Navbar bg="danger" variant="dark" fixed="top">
        <Navbar.Brand>
          <BsMusicPlayerFill value={{ size: "2em" }} className="align-icon" />
          <span className="logoText">PLAYLIST WARS</span>
        </Navbar.Brand>
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
      <Tracks tracks={playlistTracks} upvoted={upvoted} />
      <Navbar bg="secondary" variant="dark" fixed="bottom">
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
              <mark>
                {playing.artists[0].name} - {playing.name}
              </mark>{" "}
              -{" "}
              <a href="#login">
                {trackLength} - {currentTrackTime}
              </a>
            </Navbar.Text>
          </>
        ) : null}
        <Navbar.Collapse className="justify-content-end">
          {selected ? (
            <>
              <Navbar.Brand>
                <img src={playlistImage} width="30" height="30"></img>
              </Navbar.Brand>
              <Navbar.Text>
                Current Playlist: <a href="#login">{selected}</a>
              </Navbar.Text>
            </>
          ) : null}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MainContainer;

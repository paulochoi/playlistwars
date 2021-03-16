import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

const roundTime = (item) => {
  return +item < 10 ? `0${item}` : item;
};
const getDuration = (time) => {
  return `${roundTime(Math.floor(time / 1000 / 60))}:${
    (time / 1000) % 60 ? roundTime(Math.round((time / 1000) % 60)) : "00"
  }`;
};
const Tracks = ({ tracks }) => {
  useEffect(() => {
    if (tracks && tracks.items) console.log("TRACKS====", tracks.items);
  }, [tracks]);
  return (
    <Container className="pt-5 mt-5 pb-5 mb-5">
      <ul>
        {tracks && tracks.items ? (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th></th>
                <th>Artist</th>
                <th>Track Name</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {tracks.items.slice(0, 20).map((t) => (
                <tr>
                  <td></td>
                  <td>
                    <img
                      src={t.track.album.images[2].url}
                      width="30"
                      height="30"
                    ></img>
                    <span className="pl-1">
                      {t.track.album.artists[0].name}{" "}
                    </span>
                  </td>
                  <td>{t.track.name}</td>
                  <td>{getDuration(t.track.duration_ms)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </ul>
    </Container>
  );
};

export default Tracks;

import React, { useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import { BiUpvote } from "react-icons/bi";

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
    if (tracks && tracks.items) console.log("TRACKS====", tracks);
  }, [tracks]);

  return (
    <Container fluid className="pt-5 mt-4 pb-5 mb-4">
      <ul>
        {tracks && tracks.items ? (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th></th>
                <th>Artist</th>
                <th>Track Name</th>
                <th>Album</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {tracks.items.slice(0, 20).map((t) => (
                <tr>
                  <td className="text-center">
                    <div className="triangle-up"></div>
                    {tracks.votes}
                    <div className="triangle-down"></div>
                  </td>
                  <td className="align-middle">
                    <img
                      src={t.track.album.images[2].url}
                      width="30"
                      height="30"
                    ></img>
                    <span className="pl-1">{t.track.artists[0].name} </span>
                  </td>
                  <td className="align-middle">{t.track.name}</td>
                  <td className="align-middle">{t.track.album.name}</td>
                  <td className="align-middle">
                    {getDuration(t.track.duration_ms)}
                  </td>
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

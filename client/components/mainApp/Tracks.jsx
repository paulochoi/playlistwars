import React, { useEffect, useState } from "react";
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
const Tracks = ({ tracks, upvoted }) => {
  useEffect(() => {
    // if (tracks && tracks.length > 0) console.log("TRACKS====", tracks);
  }, [tracks]);

  return (
    <Container fluid className="pt-5 mt-4 pb-5 mb-4">
      {tracks && tracks.length > 0 ? (
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
            {tracks.slice(0, 20).map((t) => (
              <tr>
                <td className="text-center">
                  <div
                    className="triangle-up"
                    onClick={() => upvoted(t.id, t.name)}
                  ></div>
                  {t.votes}
                  {/* <div className="triangle-down"></div> */}
                </td>
                <td className="align-middle">
                  <img src={t.album.images[2].url} width="30" height="30"></img>
                  <span className="pl-1">{t.artists[0].name} </span>
                </td>
                <td className="align-middle">{t.name}</td>
                <td className="align-middle">{t.album.name}</td>
                <td className="align-middle">{getDuration(t.duration_ms)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </Container>
  );
};

export default Tracks;

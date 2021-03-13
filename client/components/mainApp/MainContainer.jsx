import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Select from "react-select";

const MainContainer = ({ name, image, playLists }) => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const tempOptions = [];
    if (playLists && playLists.length > 0) {
      console.log("Loaded Playlist");
      console.log(playLists);
      for (const p of playLists) {
        if (p.images[2]) {
          tempOptions.push({
            value: p.ur,
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
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MainContainer;

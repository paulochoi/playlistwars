import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import queryString from "query-string";

const url = "http://localhost:3000";
const Login = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    const loginState = parsed.access_token;
    if (loginState) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + loginState },
      })
        .then((response) => response.json())
        .then((val) => {
          console.log(val);
          setUser(val);
        })
        .catch(() => console.log);
    }
  }, []);
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

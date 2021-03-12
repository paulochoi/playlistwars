import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const url = "http://localhost:3000";
const Login = () => {
  const clickButton = (e) => {
    fetch(`${url}/login`).then((response) => {
      window.location.href = response.url;
    });
  };
  return (
    <Button variant="primary" onClick={clickButton}>
      Primary
    </Button>
  );
};

export default Login;

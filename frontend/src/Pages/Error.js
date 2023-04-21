import React from "react";

const Error = ({ text }) => {
  return (
    <div style={{ width: "80%" }}>
      <br />
      <span style={{ fontSize: "30px", color: "#b0b0b0", margin: "50px" }}>
        {text}
      </span>
    </div>
  );
};

export default Error;

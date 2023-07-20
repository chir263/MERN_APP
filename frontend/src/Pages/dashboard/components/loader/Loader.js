import React from "react";
import "./loader.css";
import img_ from "../../../../media/loading-gif.gif";

const Loader = () => {
  return (
    <div className="loader">
      <center>
        <img
          src={img_}
          alt="loader"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "5px solid #00d7d2",
          }}
        />
      </center>
    </div>
  );
};

export default Loader;

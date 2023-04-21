import React from "react";
import "./loader.css";
import img_ from "../../../../media/loading-gif.gif";
// or
const Loader = () => {
  return (
    <div className="loader">
      {/* <div className="loader-content"> */}
      <center>
        <img
          src={img_}
          alt="loader"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "5px solid #00d7d2",
            // opacity: "0.9",
          }}
        />
        {/* <h1>Loading...</h1> */}
      </center>

      {/* Loading... */}
      {/* </div> */}
    </div>
  );
};

export default Loader;

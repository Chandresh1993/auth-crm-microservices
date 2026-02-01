import React from "react";
import loaderGif from "../assets/loader 2.gif";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <img src={loaderGif} alt="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default Loader;

import React, { useState, useEffect } from "react";
import { Box } from "rebass";
import { Map, Marker } from "pigeon-maps";

const TripMap = () => {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(() => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    setSize([window.innerHeight, window.innerWidth]);
    window.addEventListener("resize", () => {
      setSize([window.innerHeight, window.innerWidth]);
    });
    return () => {
      document.getElementsByTagName("body")[0].style.overflow = "";
    };
  }, []);
  return (
    <Box>
      <Map
        height={size[0] - 75}
        defaultCenter={[50.879, 4.6997]}
        defaultZoom={11}
      >
        <Marker width={50} anchor={[50.879, 4.6997]} />
      </Map>
    </Box>
  );
};

export default TripMap;

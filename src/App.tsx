import React, { useState } from "react";
import CompassSlider from "./compassSlider";
import { Input } from "@mui/material";
import CompassElevationSlider from "./compasselevationSlider";
const App: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const [elevation, setElevation] = useState(0);

  return (
    <>
      <CompassSlider
        radius={80}
        angle={angle}
        min={20}
        max={200}
        setAngle={(value: number) => setAngle(value)}
        elevation={elevation}
        changeElevation={(value: number) => setElevation(value)}
      />
      {/* <CompassElevationSlider radius={60} elevation={elevation} changeElevation={(value: number) => setElevation(value)}/> */}
      <Input
        type="number"
        value={angle}
        onChange={(e) => {
          setAngle(Number(e.target.value));
        }}
      />
      <div>{elevation}</div>
    </>
  );
};

export default App;

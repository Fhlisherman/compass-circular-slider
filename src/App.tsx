import React, { useState } from "react";
import CompassSlider from "./compassSlider";
import CompassElevationSlider from "./compassElevationSlider";

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
      />
      <CompassElevationSlider radius={40} elevation={elevation} changeElevation={(value: number) => setElevation(value)} />
      <input
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

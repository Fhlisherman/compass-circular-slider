import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CompassElevationSlider from "./compasselevationSlider";
type props = {
  radius: number;
  angle: number;
  setAngle: (value: number) => void;
  min: number;
  max: number;
  elevation: number
  changeElevation: (value: number) => void;
};

const CompassSlider = ({
  radius = 60,
  angle,
  setAngle,
  min = 0,
  max = 359,
  elevation,
  changeElevation
}: props) => {
  useEffect(() => {
    setAngle(Math.max(angle, min));
  }, []);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const elP = circleRef.current?.getBoundingClientRect() ?? {
      top: 0,
      left: 0,
    };
    const elPos = { x: elP.left, y: elP.top };

    if (isDragging) {
      const mPos = { x: e.clientX - elPos.x, y: e.clientY - elPos.y };
      const atan = Math.atan2(mPos.x - radius, mPos.y - radius);
      const deg = -atan / (Math.PI / 180) + 180;
      const constrainedAngle = Math.min(Math.max(Math.ceil(deg), min), max);
      setAngle(constrainedAngle);
    }
  };

  const svgSize = radius * 2;
  const arrowLength = radius * 0.7;

  // Function to describe a pizza-slice arc path
  const describeSlice = (
    startAngle: number,
    endAngle: number,
    arcRadius: number
  ) => {
    const start = polarToCartesian(radius, radius, arcRadius, endAngle);
    const end = polarToCartesian(radius, radius, arcRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${radius},${radius}`, // Move to the center
      `L ${start.x},${start.y}`, // Line to start of arc
      `A ${arcRadius},${arcRadius} 0 ${largeArcFlag} 0 ${end.x},${end.y}`, // Draw arc
      "Z", // Close path back to the center
    ].join(" ");
  };

  // Convert polar coordinates to Cartesian for SVG arc calculation
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    arcRadius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    return {
      x: centerX + arcRadius * Math.cos(angleInRadians),
      y: centerY + arcRadius * Math.sin(angleInRadians),
    };
  };

  const arcRadius = radius - 4;
  const outsideRangeSlice1 = describeSlice(0, min, arcRadius);
  const outsideRangeSlice2 = describeSlice(max, 359.9, arcRadius);

  return (
    <Box sx={{position: 'relative'}}>
      <Box
        sx={{
          position: "relative",
          width: svgSize + 40,
          height: svgSize + 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: 2,
          zIndex: 3,
        }}
      >
        <Typography variant="body2" sx={{ position: "absolute", top: 10 }}>
          N
        </Typography>

        <Box
          ref={circleRef}
          sx={{
            position: "relative",
            width: svgSize,
            height: svgSize,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={radius}
              cy={radius}
              r={radius - 2}
              stroke="#666"
              strokeWidth="2"
              fill="none"
            />

            {/* Red Slices Outside Range */}
            <path d={outsideRangeSlice1} fill="red" opacity="0.3" />
            <path d={outsideRangeSlice2} fill="red" opacity="0.3" />

            {[...Array(36)].map((_, i) => {
              const angleForLines = (i * 10 * Math.PI) / 180;
              const x1 = radius + Math.cos(angleForLines) * (radius - 10);
              const y1 = radius - Math.sin(angleForLines) * (radius - 10);
              const x2 = radius + Math.cos(angleForLines) * (radius - 5);
              const y2 = radius - Math.sin(angleForLines) * (radius - 5);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 9 === 0 ? "#333" : "#bbb"}
                  strokeWidth={i % 9 === 0 ? 2 : 1}
                />
              );
            })}
            <g
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: `${radius}px ${radius}px`,
              }}
            >
              <polygon
                points={`${radius},${radius - arrowLength} ${
                  radius - 5
                },${radius} ${radius + 5},${radius}`}
                fill="red"
              />
              <polygon
                points={`${radius},${radius + arrowLength - 20} ${
                  radius - 5
                },${radius} ${radius + 5},${radius}`}
                fill="blue"
              />
            </g>
          </svg>
        </Box>

        <Typography variant="body2" sx={{ position: "absolute", bottom: 10 }}>
          S
        </Typography>
        <Typography variant="body2" sx={{ position: "absolute", left: 10 }}>
          W
        </Typography>
        <Typography variant="body2" sx={{ position: "absolute", right: 10 }}>
          E
        </Typography>
      </Box>
      <Box sx={{position: 'absolute', top: 144, left: -15, zIndex: 3}}>
        <CompassElevationSlider radius={radius/2} elevation={elevation} changeElevation={changeElevation}/>
      </Box>
    </Box>
  );
};

export default CompassSlider;

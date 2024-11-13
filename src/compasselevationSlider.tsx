import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  elevation: number;
  changeElevation: (value: number) => void;
  radius: number;
};

const CompassElevationSlider: React.FC<Props> = ({
  elevation,
  changeElevation,
  radius,
}) => {
  const min = -15;
  const max = 15;
  const visualMin = -30;
  const visualMax = 30;

  useEffect(() => {
    changeElevation(Math.max(Math.min(elevation, max), min));
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
    if (!isDragging || !circleRef.current) return;

    const elP = circleRef.current.getBoundingClientRect();

    // Center coordinates of the element
    const centerX = elP.left + elP.width / 2;
    const centerY = elP.top + elP.height / 2;

    // Mouse position relative to the center of the circle
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Calculate the angle, making counterclockwise increase and clockwise decrease
    const atan = Math.atan2(dy, dx);
    let visualDeg = ((-atan * (180 / Math.PI)) + 360) % 360; // Invert angle to match desired direction
    if (visualDeg > 180) visualDeg -= 360;
    visualDeg = Math.min(Math.max(Math.ceil(visualDeg), visualMin), visualMax);

    const constrainedElevation = Math.floor(visualDeg / 2); // Map to stored range
    changeElevation(constrainedElevation);
  };

  const svgSize = radius * 2;
  const arrowLength = radius * 0.7;

  // Function to describe an arc path within the -30 to 30 visual range
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
  const outsideRangeSlice1 = describeSlice(visualMin, min * 2, arcRadius);
  const outsideRangeSlice2 = describeSlice(max * 2, visualMax, arcRadius);

  return (
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
      }}
    >
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

          {/* Ticks for every 10 degrees in visual range, centered around 0 */}
          {[...Array(7)].map((_, i) => {
            const angleForLines = ((i - 3) * 10 * Math.PI) / 180; // Adjust for center at 0
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
                stroke={i % 3 === 0 ? "#333" : "#bbb"}
                strokeWidth={i % 3 === 0 ? 2 : 1}
              />
            );
          })}

          {/* Arrow pointing based on elevation value */}
          <g
            style={{
              transform: `rotate(${-(elevation * 2 + 270)}deg)`, // Reverse rotation direction for positive up
              transformOrigin: `${radius}px ${radius}px`,
            }}
          >
            <polygon
              points={`${radius},${radius - arrowLength} ${radius - 5},${radius} ${radius + 5},${radius}`}
              fill="red"
            />
            <polygon
              points={`${radius},${radius + arrowLength - 20} ${radius - 5},${radius} ${radius + 5},${radius}`}
              fill="blue"
            />
          </g>
        </svg>
      </Box>
    </Box>
  );
};

export default CompassElevationSlider;

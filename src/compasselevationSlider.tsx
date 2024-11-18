import React, { useEffect, useRef, useState } from "react";
import { describeSlice } from "./utils";

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
  const visualMin = -30;
  const visualMax = 30;

  const circleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !circleRef.current) return;

      const elP = circleRef.current.getBoundingClientRect();
      const centerX = elP.left + elP.width / 2;
      const centerY = elP.top + elP.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const atan = Math.atan2(dy, dx);
      let visualDeg = (-atan * (180 / Math.PI) + 360) % 360;
      if (visualDeg > 180) visualDeg -= 360;
      visualDeg = Math.min(
        Math.max(Math.ceil(visualDeg), visualMin),
        visualMax
      );

      const constrainedElevation = Math.floor(visualDeg / 2);
      changeElevation(constrainedElevation);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, visualMin, visualMax, changeElevation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const svgSize = radius * 2;
  const arrowLength = radius * 0.7;
  const arcRadius = radius - 4;
  const highlightArc = describeSlice(58, 122, arcRadius, radius);

  return (
    <div
      style={{
        position: "relative",
        width: `${svgSize + 40}px`,
        height: `${svgSize + 40}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      <div
        ref={circleRef}
        style={{
          position: "relative",
          width: `${svgSize}px`,
          height: `${svgSize}px`,
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={handleMouseDown}
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

          <path
            d={highlightArc}
            fill="white"
            stroke="black"
            opacity={0.8}
            strokeWidth="1"
          />

          {/* Degree Ticks */}
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
              transform: `rotate(${-(elevation * 2 + 270)}deg)`,
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
      </div>
    </div>
  );
};

export default CompassElevationSlider;

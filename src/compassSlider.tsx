import React, { useState, useRef, useEffect } from "react";
import { describeSlice } from "./utils";

type Props = {
  radius: number;
  angle: number;
  setAngle: (value: number) => void;
  min?: number;
  max?: number;
};

const CompassSlider = ({
  radius = 60,
  angle,
  setAngle,
  min = 0,
  max = 359.999,
}: Props) => {
  useEffect(() => {
    setAngle(Math.max(angle, min));
  }, [angle, min, setAngle]);

  const circleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !circleRef.current) return;

      const elP = circleRef.current.getBoundingClientRect();
      const elPos = { x: elP.left, y: elP.top };

      const mPos = { x: e.clientX - elPos.x, y: e.clientY - elPos.y };
      const atan = Math.atan2(mPos.x - radius, mPos.y - radius);
      const deg = -atan / (Math.PI / 180) + 180;
      const constrainedAngle = Math.min(Math.max(Math.ceil(deg), min), max);
      setAngle(constrainedAngle);
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
  }, [isDragging, radius, min, max, setAngle]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const svgSize = radius * 2;
  const arrowLength = radius * 0.7;

  



  const arcRadius = radius - 4;
  const outsideRangeSlice1 = describeSlice(0, min, arcRadius, radius);
  const outsideRangeSlice2 = describeSlice(max, 359.9999999999, arcRadius, radius);

  return (
      <div
        style={{
          position: "relative",
          width: `${svgSize + 70}px`,
          height: `${svgSize + 70}px`,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <span style={{ position: "absolute", top: "10px", userSelect: "none" }}>N</span>

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
                points={`${radius},${radius - arrowLength} ${radius - 5},${radius} ${radius + 5},${radius}`}
                fill="red"
              />
              <polygon
                points={`${radius},${radius + arrowLength - 20} ${radius - 5},${radius} ${radius + 5},${radius}`}
                fill="blue"
              />
            </g>
          </svg>
        </div>

        <span style={{ position: "absolute", bottom: "10px", userSelect: "none" }}>S</span>
        <span style={{ position: "absolute", left: "10px", userSelect: "none" }}>W</span>
        <span style={{ position: "absolute", right: "10px", userSelect: "none" }}>E</span>
      </div>
  );
};

export default CompassSlider;

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { describeSlice } from "../utils/utils";

type Props = {
  radius: number;
  angle: number;
  changeAngle: (value: number) => void;
  min?: number;
  max?: number;
};

const CompassSlider: React.FC<Props> = ({
  radius = 60,
  angle,
  changeAngle,
  min = 0,
  max = 359.999,
}: Props) => {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !circleRef.current) return;

      const elementPoint = circleRef.current.getBoundingClientRect();
      const elementPosition = { x: elementPoint.left, y: elementPoint.top };

      const middlePosition = { x: e.clientX - elementPosition.x, y: e.clientY - elementPosition.y };
      const atan = Math.atan2(
        middlePosition.x - radius,
        middlePosition.y - radius
      );
      const deg = -atan / (Math.PI / 180) + 180;
      const constrainedAngle = Math.min(Math.max(Math.ceil(deg), min), max);
      changeAngle(constrainedAngle);
    },
    [isDragging, radius, min, max, changeAngle]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const svgSize = radius * 2;
  const arrowLength = radius * 0.7;
  const outsideRangeSlices = useMemo(() => {
    const arcRadius = radius - 4;
    return {
      slice1: describeSlice(0, min, arcRadius, radius),
      slice2: describeSlice(max, 359.9999999999, arcRadius, radius),
    };
  }, [radius, min, max]);

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
      <span style={{ position: "absolute", top: "10px", userSelect: "none" }}>
        N
      </span>

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
           <path d={outsideRangeSlices.slice1} fill="red" opacity="0.3" />
           <path d={outsideRangeSlices.slice2} fill="red" opacity="0.3" />
          {[...Array(36)].map((_, index) => {
            const angleForLines = (index * 10 * Math.PI) / 180;
            const x1 = radius + Math.cos(angleForLines) * (radius - 10);
            const y1 = radius - Math.sin(angleForLines) * (radius - 10);
            const x2 = radius + Math.cos(angleForLines) * (radius - 5);
            const y2 = radius - Math.sin(angleForLines) * (radius - 5);
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={index % 9 === 0 ? "#333" : "#bbb"}
                strokeWidth={index % 9 === 0 ? 2 : 1}
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
      </div>

      <span
        style={{ position: "absolute", bottom: "10px", userSelect: "none" }}
      >
        S
      </span>
      <span style={{ position: "absolute", left: "10px", userSelect: "none" }}>
        W
      </span>
      <span style={{ position: "absolute", right: "10px", userSelect: "none" }}>
        E
      </span>
    </div>
  );
};

export default CompassSlider;

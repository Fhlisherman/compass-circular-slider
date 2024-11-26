import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSliceSVGPath } from "../utils/utils";

type Props = {
  elevation: number;
  changeElevation: (value: number) => void;
  radius: number;
};

const VISUALMIN = -30;
const VISUALMAX = 30;

const CompassElevationSlider: React.FC<Props> = ({
  elevation,
  changeElevation,
  radius,
}) => {
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !circleRef.current) return;

      const elementPoint = circleRef.current.getBoundingClientRect();
      const centerX = elementPoint.left + elementPoint.width / 2;
      const centerY = elementPoint.top + elementPoint.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const atan = Math.atan2(dy, dx);
      const tempDegree = (-atan * (180 / Math.PI) + 360) % 360;
      const visualDegree =
        tempDegree > 180
          ? Math.min(
              Math.max(Math.ceil(tempDegree - 360), VISUALMIN),
              VISUALMAX
            )
          : Math.min(Math.max(Math.ceil(tempDegree), VISUALMIN), VISUALMAX);

      const constrainedElevation = Math.floor(visualDegree / 2);
      changeElevation(constrainedElevation);
    },
    [isDragging, changeElevation]
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

  const { svgSize, arrowLength, highlightArc } = useMemo(() => {
    return {
      svgSize: radius * 2,
      arrowLength: radius * 0.7,
      highlightArc: createSliceSVGPath(58, 122, radius - 4, radius),
    };
  }, [radius]);
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
          {[...Array(7)].map((_, index) => {
            const angleForLines = ((index - 3) * 10 * Math.PI) / 180; // Adjust for center at 0
            const startX = radius + Math.cos(angleForLines) * (radius - 10);
            const startY = radius - Math.sin(angleForLines) * (radius - 10);
            const endX = radius + Math.cos(angleForLines) * (radius - 5);
            const endY = radius - Math.sin(angleForLines) * (radius - 5);
            return (
              <line
                key={index}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={index % 3 === 0 ? "#333" : "#bbb"}
                strokeWidth={index % 3 === 0 ? 2 : 1}
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

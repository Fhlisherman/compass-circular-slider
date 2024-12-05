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

const createSliceSVGPath = (
  startAngle: number,
  endAngle: number,
  arcRadius: number,
  radius: number
): string => {
  const start = polarToCartesian(radius, radius, arcRadius, endAngle);
  const end = polarToCartesian(radius, radius, arcRadius, startAngle);

  let deltaAngle = endAngle - startAngle;
  if (deltaAngle < 0) deltaAngle += 360; 

  const largeArcFlag = deltaAngle > 180 ? "1" : "0";

  return [
    `M ${radius},${radius}`, 
    `L ${start.x},${start.y}`,
    `A ${arcRadius},${arcRadius} 0 ${largeArcFlag} 0 ${end.x},${end.y}`, 
    "Z", 
  ].join(" ");
};
export { createSliceSVGPath };

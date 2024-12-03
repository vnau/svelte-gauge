// Clamp value between min and max
export const clamp = (val: number, minVal: number, maxVal: number) =>
    Math.max(minVal, Math.min(maxVal, val));

// Map value to an angle (in radians)
export const valueToAngle = (value: number, min: number, max: number, startAngle: number, stopAngle: number) =>
    startAngle + (stopAngle - startAngle) * (clamp(value, min, max) - min) / (max - min);

export const getTitleAngle = (startAngle: number, stopAngle: number, index: number, count: number) => {
    const isCircleGauge = Math.abs(Math.abs(stopAngle - startAngle) - 2 * Math.PI) < 0.001;
    return startAngle + (index / (count - (isCircleGauge ? 0 : 1))) * (stopAngle - startAngle)
}
// Convert polar coordinates to Cartesian
export const polarToCartesian = (radius: number, offset: number, angle: number) => {
    const adjustedRadius = radius - offset;
    return {
        x: (radius - adjustedRadius * Math.sin(angle)).toFixed(2),
        y: (radius + adjustedRadius * Math.cos(angle)).toFixed(2),
    };
};

// Generate SVG path for an arc
export const calcCurvePath = (
    radius: number,
    offset: number,
    startAngle: number,
    stopAngle: number
) => {
    if (stopAngle - startAngle >= 2 * Math.PI)
        stopAngle = startAngle + 2 * Math.PI - 0.0001;
    const start = polarToCartesian(radius, offset, startAngle);
    const end = polarToCartesian(radius, offset, stopAngle);
    const largeArc = stopAngle - startAngle > Math.PI ? 1 : 0;
    const sweepFlag = stopAngle > startAngle ? 1 : 0;
    return `M ${start.x} ${start.y} A
      ${radius - offset} ${radius - offset} 
      0 ${largeArc} ${sweepFlag} ${end.x} ${end.y}`;
};
// Clamp value between min and max
const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

export const scale = (
    value: number,
    start: number,
    stop: number,
    targetStart: number,
    targetStop: number
): number =>
    targetStart + ((targetStop - targetStart) * (clamp(value, start, stop) - start)) / (stop - start);

// Calculate label offset based on index and total number of labels
export const calcLabelOffset = (
    index: number,
    count: number,
    center: boolean
): number => {
    const c = (count === 1 && !center) ? 0 : (index + (center ? 0.5 : 0)) / (count - (center ? 0 : 1));
    return Math.round((25 + 50 * c) * 100) / 100;
};

// Convert polar coordinates to Cartesian
export const polarToCartesian = (
    radius: number,
    offset: number,
    angle: number
): { x: string; y: string } => {
    const adjustedRadius = radius - offset;
    return {
        x: (radius - adjustedRadius * Math.sin(angle)).toFixed(3),
        y: (radius + adjustedRadius * Math.cos(angle)).toFixed(3),
    };
};

// Generate SVG path for an arc
export const calcCurvePath = (radius: number, offset: number, startAngle: number, endAngle: number): string => {
    const toRadians = (angle: number) => (angle * Math.PI) / 180;
    const startRad = toRadians(startAngle);
    const endRad = toRadians(endAngle);

    const startPoint = polarToCartesian(radius, offset, startRad);

    // Helper to generate an arc command for SVG path
    const arcCommand = (fromAngle: number, toAngle: number): string => {
        toAngle = Math.min(toAngle, fromAngle + Math.PI * 1.9999)
        const endPoint = polarToCartesian(radius, offset, toAngle);
        const largeArcFlag = toAngle - fromAngle > Math.PI ? 1 : 0;
        const sweepFlag = toAngle > fromAngle ? 1 : 0;
        return `A ${radius - offset} ${radius - offset} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}`;
    };

    // Determine whether to split into two arcs for full circles
    let cmd = `M ${startPoint.x} ${startPoint.y}`;
    let arcStart = startRad
    do {
        const arcStop = arcStart + Math.min(Math.PI * 1.9999, endRad - arcStart)
        cmd += ` ${arcCommand(arcStart, arcStop)}`;
        arcStart = arcStop;
    } while (arcStart < endRad)

    return cmd;
};

// Define a type for the display value handler
export type DisplayValueHandler = (args: {
    value: number | undefined;
    animatedValue: number;
    formattedValue: string;
}) => string;

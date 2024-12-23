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

function lineIntersection(m1: number, b1: number, m2: number, b2: number) {
    if (m1 === m2)
        return undefined;

    const x = (b2 - b1) / (m1 - m2);
    return { x: x, y: m1 * x + b1 };
}

function pStr(point: { x: number, y: number }) {
    return `${point.x.toFixed(2)},${point.y.toFixed(2)} `;
}

function getPath(center: { x: number, y: number }, startRadius: number, spacePerLoop: number, startTheta: number, endTheta: number, thetaStep: number) {
    // Rename spiral parameters for the formula r = a + bθ
    const a = startRadius;  // start distance from center
    const b = spacePerLoop / Math.PI / 2; // space between each loop

    // convert angles to radians
    let oldTheta = startTheta * Math.PI / 180;
    let newTheta = oldTheta;
    endTheta = endTheta * Math.PI / 180;
    thetaStep = thetaStep * Math.PI / 180;

    // radii
    let oldR,
        newR = a + b * newTheta;

    // start and end points
    const oldPoint = { x: 0, y: 0 };
    const newPoint = {
        x: center.x + newR * Math.cos(newTheta),
        y: center.y + newR * Math.sin(newTheta)
    };

    // slopes of tangents
    let oldSlope: number = 0;
    let newSlope: number = (b * Math.sin(oldTheta) + (a + b * newTheta) * Math.cos(oldTheta)) /
        (b * Math.cos(oldTheta) - (a + b * newTheta) * Math.sin(oldTheta));

    let path = "M " + pStr(newPoint);

    while (oldTheta < endTheta) {
        oldTheta = newTheta;
        newTheta += Math.min(thetaStep, endTheta - oldTheta);

        oldR = newR;
        newR = a + b * newTheta;

        oldPoint.x = newPoint.x;
        oldPoint.y = newPoint.y;
        newPoint.x = center.x + newR * Math.cos(newTheta);
        newPoint.y = center.y + newR * Math.sin(newTheta);

        // Slope calculation with the formula:
        // (b * sinΘ + (a + bΘ) * cosΘ) / (b * cosΘ - (a + bΘ) * sinΘ)
        const aPlusBTheta = a + b * newTheta;

        oldSlope = newSlope;
        newSlope = (b * Math.sin(newTheta) + aPlusBTheta * Math.cos(newTheta)) /
            (b * Math.cos(newTheta) - aPlusBTheta * Math.sin(newTheta));

        const oldIntercept = -(oldSlope * oldR * Math.cos(oldTheta) - oldR * Math.sin(oldTheta));
        const newIntercept = -(newSlope * newR * Math.cos(newTheta) - newR * Math.sin(newTheta));

        const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);
        if (controlPoint) {
            // Offset the control point by the center offset.
            controlPoint.x += center.x;
            controlPoint.y += center.y;

            path += "Q " + pStr(controlPoint) + pStr(newPoint);
        }
    }

    return path;
}

// Generate SVG path for an arc
export const calcCurvePath = (radius: number, offset: number, startAngle: number, endAngle: number): string => {
    return getPath({ x: radius, y: radius }, radius - offset, -offset / 2, startAngle + 90, endAngle + 90, 10);
};

// Define a type for the display value handler
export type DisplayValueHandler = (args: {
    value: number | undefined;
    animatedValue: number;
    formattedValue: string;
}) => string;

export type Segment = {
    start: number;
    stop: number;
    color?: string;
    label?: string;
} | [number, number]

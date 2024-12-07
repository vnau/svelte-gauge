// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

// Scale value
export const scale = (value: number, start: number, stop: number, targetStart: number, targetStop: number): number =>
    targetStart + (targetStop - targetStart) * (clamp(value, start, stop) - start) / (stop - start);

// Calculate title offset based on index and total count
export const getTitleOffset = (startAngle: number, stopAngle: number, index: number, count: number): number => {
    const fullCircle = 360;
    const isCircleGauge = Math.abs(stopAngle - startAngle - fullCircle) < 0.001;
    const normalizedIndex = index / (count - (isCircleGauge || count === 1 ? 0 : 1));
    const angle = normalizedIndex * fullCircle;

    // Offset calculation based on proportional angle
    return Math.abs(25 + (50 * angle) / fullCircle);
};

// Convert polar coordinates to Cartesian
export const polarToCartesian = (radius: number, offset: number, angle: number): { x: string; y: string } => {
    const adjustedRadius = radius - offset;
    return {
        x: (radius - adjustedRadius * Math.sin(angle)).toFixed(3),
        y: (radius + adjustedRadius * Math.cos(angle)).toFixed(3),
    };
};

// Generate SVG path for an arc
export const calcCurvePath = (radius: number, offset: number, startAngle: number, endAngle: number): string => {
    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

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
        const arcStop = arcStart + Math.min(Math.PI * 2, endRad - arcStart)
        cmd += ` ${arcCommand(arcStart, arcStop)}`;
        arcStart = arcStop;
    } while (arcStart < endRad)

    return cmd;
};

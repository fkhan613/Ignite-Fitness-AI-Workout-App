export function nextLoad(currentLoad, history) {
    if (!currentLoad)
        return undefined;
    const last = history.slice(-3);
    const hitTopRangeOften = last.filter(s => s.reps >= 10).length >= 2;
    if (hitTopRangeOften)
        return Math.round(currentLoad * 1.025 * 2) / 2; // +2.5%
    return currentLoad;
}

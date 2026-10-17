'use strict';
(function (root, factory) {
  const createLapTracker = factory();
  if (typeof module === 'object' && module.exports) module.exports = createLapTracker;
  root.createLapTracker = createLapTracker;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  return function createLapTracker(trackLength, gateCount = 4) {
    if (!Number.isInteger(trackLength) || trackLength < gateCount * 2 ||
        !Number.isInteger(gateCount) || gateCount < 2) throw new RangeError('Invalid track gates');
    const gates = Array.from({length: gateCount}, (_, i) =>
      Math.floor(i * trackLength / gateCount));
    let previous = 0;
    let nextGate = 1;
    return {
      reset(index = 0) {
        previous = index;
        nextGate = 1;
      },
      update(index, onTrack = true) {
        if (!Number.isInteger(index) || index < 0 || index >= trackLength) return false;
        const forward = (index - previous + trackLength) % trackLength;
        const limit = Math.max(4, Math.floor(trackLength / 12));
        const valid = onTrack && forward > 0 && forward <= limit;
        const gate = gates[nextGate];
        const crossed = gate === 0
          ? previous > index
          : previous < gate && index >= gate;
        previous = index;
        if (!valid || !crossed) return false;
        nextGate = (nextGate + 1) % gateCount;
        return nextGate === 1;
      }
    };
  };
});

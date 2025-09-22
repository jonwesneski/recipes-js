export const timeInHourAndMinutes = (...timesInMinutes: (number | null)[]) => {
  if (timesInMinutes.some((time) => time === null)) {
    return null;
  }
  const totalMinutes = (timesInMinutes as number[]).reduce(
    (sum, current) => sum + current,
    0,
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

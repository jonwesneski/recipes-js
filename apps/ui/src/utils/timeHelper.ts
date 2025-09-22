export const timeInHourAndMinutes = (
  preparationTimeInMinutes: number | null,
  cookingTimeInMinutes: number | null,
) => {
  if (preparationTimeInMinutes === null || cookingTimeInMinutes === null) {
    return null;
  }
  const totalMinutes = preparationTimeInMinutes + cookingTimeInMinutes;
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

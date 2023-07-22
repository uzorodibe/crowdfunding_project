export const daysLeft = deadline => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = Math.max(difference / (1000 * 3600 * 24), 0);

  return remainingDays.toFixed(0);
};

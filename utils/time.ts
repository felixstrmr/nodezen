export function formatTimeDifference(date1: Date, date2: Date): string {
  const differenceInMs = Math.abs(date2.getTime() - date1.getTime());

  if (differenceInMs < 1000) {
    return `${differenceInMs}ms`;
  }

  const differenceInSeconds = Math.floor(differenceInMs / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);

  if (differenceInMinutes < 60) {
    const remainingSeconds = differenceInSeconds % 60;
    return remainingSeconds > 0
      ? `${differenceInMinutes}m ${remainingSeconds}s`
      : `${differenceInMinutes}m`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    const remainingMinutes = differenceInMinutes % 60;
    return remainingMinutes > 0
      ? `${differenceInHours}h ${remainingMinutes}m`
      : `${differenceInHours}h`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  const remainingHours = differenceInHours % 24;

  return remainingHours > 0
    ? `${differenceInDays}d ${remainingHours}h`
    : `${differenceInDays}d`;
}

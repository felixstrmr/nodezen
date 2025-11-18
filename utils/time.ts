export function formatDuration(durationMs: number) {
  const differenceInMs = Math.abs(durationMs);

  if (differenceInMs < 1000) {
    return `${differenceInMs.toFixed(0)}ms`;
  }

  const differenceInSeconds = Math.floor(differenceInMs / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds.toFixed(0)}s`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes.toFixed(0)}m`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours.toFixed(0)}h`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays < 30) {
    return `${differenceInDays.toFixed(0)}d`;
  }

  const differenceInMonths = Math.floor(differenceInDays / 30);

  if (differenceInMonths < 12) {
    return `${differenceInMonths.toFixed(0)}mo`;
  }

  const differenceInYears = Math.floor(differenceInMonths / 12);

  if (differenceInYears < 100) {
    return `${differenceInYears.toFixed(0)}y`;
  }

  return `${differenceInYears.toFixed(0)}y+`;
}

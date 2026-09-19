/** Parse YYYY-MM-DD as local calendar date (avoids UTC off-by-one). */
export const parseLocalDate = (isoDate) => {
  if (!isoDate) return null;
  if (isoDate instanceof Date) {
    return Number.isNaN(isoDate.getTime()) ? null : isoDate;
  }
  const datePart = String(isoDate).slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

/** Format a date-only API value for display in the user's locale. */
export const formatLocalDate = (dateInput, options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}) => {
  const date = parseLocalDate(dateInput);
  if (!date || Number.isNaN(date.getTime())) {
    return dateInput ? String(dateInput) : 'Date not specified';
  }
  return date.toLocaleDateString('en-US', options);
};

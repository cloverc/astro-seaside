const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeZone: "UTC",
  timeStyle: "short",
});

export const getFormattedDate = (date: Date): string =>
  date ? formatter.format(date) : "";

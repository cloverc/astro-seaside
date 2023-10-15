const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeZone: "UTC",
  timeStyle: "short",
});

export const getFormattedDate = (date: Date): string =>
  date ? formatter.format(date) : "";

export const trim = (str = "", ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

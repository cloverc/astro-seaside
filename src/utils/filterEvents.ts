export function filterAndSortEvents(
  events: any[],
  now: Date,
  upcoming: boolean,
) {
  return events
    .filter((event) => {
      const rawDate = event?.content?.date;
      const eventDate = rawDate ? new Date(rawDate) : null;

      return (
        eventDate &&
        !isNaN(eventDate.getTime()) &&
        (upcoming ? eventDate >= now : eventDate < now)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.content.date).getTime();
      const dateB = new Date(b.content.date).getTime();
      return upcoming ? dateA - dateB : dateB - dateA;
    });
}

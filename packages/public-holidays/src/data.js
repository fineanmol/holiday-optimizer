/**
 * Versioned public-holiday tables. Extend `byYear` when you add a new calendar year.
 * India list is a national / commonly observed set; states differ — verify locally.
 */
export const REGIONS = {
  "germany-berlin": {
    id: "germany-berlin",
    name: "Germany (Berlin)",
    byYear: {
      2026: [
        { date: "2026-01-01", name: "Neujahr" },
        { date: "2026-03-08", name: "Internationaler Frauentag (Berlin)" },
        { date: "2026-04-03", name: "Karfreitag" },
        { date: "2026-04-06", name: "Ostermontag" },
        { date: "2026-05-01", name: "Tag der Arbeit" },
        { date: "2026-05-14", name: "Christi Himmelfahrt" },
        { date: "2026-05-25", name: "Pfingstmontag" },
        { date: "2026-10-03", name: "Tag der Deutschen Einheit" },
        { date: "2026-10-31", name: "Reformationstag (Berlin)" },
        { date: "2026-12-25", name: "1. Weihnachtstag" },
        { date: "2026-12-26", name: "2. Weihnachtstag" },
      ],
    },
  },
  india: {
    id: "india",
    name: "India (national / commonly observed)",
    byYear: {
      2026: [
        { date: "2026-01-26", name: "Republic Day" },
        { date: "2026-03-08", name: "Holi" },
        { date: "2026-03-29", name: "Good Friday" },
        { date: "2026-04-14", name: "Ambedkar Jayanti" },
        { date: "2026-04-17", name: "Ram Navami" },
        { date: "2026-05-01", name: "Labour Day" },
        { date: "2026-06-17", name: "Eid ul-Fitr" },
        { date: "2026-08-15", name: "Independence Day" },
        { date: "2026-08-26", name: "Raksha Bandhan" },
        { date: "2026-09-05", name: "Janmashtami" },
        { date: "2026-10-02", name: "Gandhi Jayanti" },
        { date: "2026-10-12", name: "Dussehra" },
        { date: "2026-10-20", name: "Eid ul-Adha" },
        { date: "2026-10-29", name: "Diwali" },
        { date: "2026-11-14", name: "Guru Nanak Jayanti" },
        { date: "2026-12-25", name: "Christmas" },
      ],
    },
  },
};

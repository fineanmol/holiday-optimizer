export const countryPresets = {
  germany: {
    name: "Germany (Berlin)",
    year: 2026,
    defaultPTO: 19,
    holidays: [
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

  india: {
    name: "India",
    year: 2026,
    defaultPTO: 10,
    holidays: [
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
};

/**
 * Get all available country keys
 * @returns {string[]} Array of country keys
 */
export function getAvailableCountries() {
  return Object.keys(countryPresets);
}

/**
 * Get country information (name, key pairs)
 * @returns {Array<{key: string, name: string}>} Array of country info objects
 */
export function getCountryList() {
  return Object.entries(countryPresets).map(([key, preset]) => ({
    key,
    name: preset.name,
  }));
}

/**
 * Get preset configuration for a country
 * @param {string} countryKey - Key from countryPresets (e.g., 'germany', 'india')
 * @param {number} customPTO - Optional custom PTO days (overrides default)
 * @param {number} customYear - Optional custom year (overrides preset year)
 * @returns {Object} Configuration object ready for optimizer
 */
export function getPreset(countryKey, customPTO = null, customYear = null) {
  const preset = countryPresets[countryKey];
  if (!preset) {
    throw new Error(
      `Unknown country preset: ${countryKey}. Available: ${getAvailableCountries().join(
        ", "
      )}`
    );
  }

  const year = customYear ?? preset.year;

  const holidays = preset.holidays.filter((h) => {
    const holidayYear = parseInt(h.date.split("-")[0]);
    return holidayYear === year;
  });

  return {
    numberOfDays: customPTO ?? preset.defaultPTO,
    year: year,
    holidays: holidays,
    companyDaysOff: [],
  };
}

/**
 * Check if a country preset exists
 * @param {string} countryKey - Key to check
 * @returns {boolean} True if preset exists
 */
export function hasPreset(countryKey) {
  return countryKey in countryPresets;
}

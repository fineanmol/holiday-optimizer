import { REGIONS } from "./data.js";

/** @typedef {{ date: string, name: string }} Holiday */

/**
 * @param {Date | string} d
 * @returns {string} YYYY-MM-DD (local calendar date when `Date` is used)
 */
export function toISODate(d) {
  if (typeof d === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    throw new TypeError(`Expected ISO date string YYYY-MM-DD, got: ${d}`);
  }
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    throw new TypeError("Expected a valid Date");
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * @returns {{ id: string, name: string }[]}
 */
export function listRegions() {
  return Object.values(REGIONS).map(({ id, name }) => ({ id, name }));
}

/**
 * @param {string} regionId
 * @returns {{ id: string, name: string, byYear: Record<number, Holiday[]> } | undefined}
 */
export function getRegion(regionId) {
  return REGIONS[regionId];
}

/**
 * @param {string} regionId
 * @param {number} year
 * @returns {Holiday[]}
 */
export function holidaysInYear(regionId, year) {
  const region = REGIONS[regionId];
  if (!region) return [];
  const list = region.byYear[year];
  return list ? [...list] : [];
}

/**
 * @param {Date | string} date
 * @param {string} regionId
 * @returns {boolean}
 */
export function isHoliday(date, regionId) {
  return holidayOn(date, regionId) != null;
}

/**
 * @param {Date | string} date
 * @param {string} regionId
 * @returns {Holiday | null}
 */
export function holidayOn(date, regionId) {
  const iso = toISODate(date);
  const year = Number(iso.slice(0, 4));
  const list = holidaysInYear(regionId, year);
  return list.find((h) => h.date === iso) ?? null;
}

/**
 * First holiday on or after `fromDate` (inclusive), or `null` if none in bundled data.
 * @param {Date | string} fromDate
 * @param {string} regionId
 * @returns {Holiday | null}
 */
export function nextHoliday(fromDate, regionId) {
  const iso = toISODate(fromDate);
  const region = REGIONS[regionId];
  if (!region) return null;

  /** @type {Holiday[]} */
  let merged = [];
  for (const y of Object.keys(region.byYear)
    .map(Number)
    .sort((a, b) => a - b)) {
    merged = merged.concat(holidaysInYear(regionId, y));
  }
  merged.sort((a, b) => a.date.localeCompare(b.date));
  return merged.find((h) => h.date >= iso) ?? null;
}

/**
 * Last holiday on or before `fromDate` (inclusive), or `null` if none in bundled data.
 * @param {Date | string} fromDate
 * @param {string} regionId
 * @returns {Holiday | null}
 */
export function previousHoliday(fromDate, regionId) {
  const iso = toISODate(fromDate);
  const region = REGIONS[regionId];
  if (!region) return null;

  /** @type {Holiday[]} */
  let merged = [];
  for (const y of Object.keys(region.byYear)
    .map(Number)
    .sort((a, b) => a - b)) {
    merged = merged.concat(holidaysInYear(regionId, y));
  }
  merged.sort((a, b) => a.date.localeCompare(b.date));
  let last = null;
  for (const h of merged) {
    if (h.date <= iso) last = h;
  }
  return last;
}

export { REGIONS } from "./data.js";

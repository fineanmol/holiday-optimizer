export type Holiday = { date: string; name: string };

export type Region = {
  id: string;
  name: string;
  byYear: Record<number, Holiday[]>;
};

export function toISODate(d: Date | string): string;

export function listRegions(): { id: string; name: string }[];

export function getRegion(regionId: string): Region | undefined;

export function holidaysInYear(regionId: string, year: number): Holiday[];

export function isHoliday(date: Date | string, regionId: string): boolean;

export function holidayOn(date: Date | string, regionId: string): Holiday | null;

export function nextHoliday(
  fromDate: Date | string,
  regionId: string
): Holiday | null;

export function previousHoliday(
  fromDate: Date | string,
  regionId: string
): Holiday | null;

export const REGIONS: Record<string, Region>;

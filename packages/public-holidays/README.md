# @fineanmol/public-holidays

Small, **zero-runtime-dependency** lookups for **public holidays** bundled as versioned data. Use it in Node or any bundler that supports ES modules.

**Pairs well with** [`@fineanmol/holiday-optimizer`](https://www.npmjs.com/package/@fineanmol/holiday-optimizer) for PTO planning.

## Install

```bash
npm install @fineanmol/public-holidays
```

## Regions

| `regionId`         | Notes |
|--------------------|--------|
| `germany-berlin`   | Berlin-specific days included where applicable |
| `india`            | National / commonly observed set; **states differ** — confirm locally for payroll |

Data is shipped per **calendar year** in `src/data.js` (`byYear`). Add new years as you maintain the package.

## API

```js
import {
  listRegions,
  holidaysInYear,
  isHoliday,
  holidayOn,
  nextHoliday,
  previousHoliday,
  toISODate,
} from "@fineanmol/public-holidays";
```

- **`listRegions()`** — `{ id, name }[]`
- **`holidaysInYear(regionId, year)`** — `{ date: 'YYYY-MM-DD', name }[]`
- **`isHoliday(date, regionId)`** — `boolean` (`date`: `Date` or ISO `YYYY-MM-DD`)
- **`holidayOn(date, regionId)`** — holiday object or `null`
- **`nextHoliday(fromDate, regionId)`** — first holiday **on or after** `fromDate`, or `null`
- **`previousHoliday(fromDate, regionId)`** — last holiday **on or before** `fromDate`, or `null`
- **`toISODate(date)`** — normalize to `YYYY-MM-DD` (local calendar day for `Date`)

## Example

```js
import { isHoliday, nextHoliday, holidaysInYear } from "@fineanmol/public-holidays";

holidaysInYear("germany-berlin", 2026).length;
// → 11

isHoliday("2026-10-03", "germany-berlin");
// → true

nextHoliday("2026-10-02", "germany-berlin");
// → { date: '2026-10-03', name: 'Tag der Deutschen Einheit' }
```

## Disclaimer

Holiday rules change. This package is for **apps and planning**, not legal or payroll advice. Verify official sources for compliance.

## License

MIT

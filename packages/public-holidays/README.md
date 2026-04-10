# @fineanmol/public-holidays

Public holiday lookups for Germany (Berlin) and India, with no runtime dependencies. Works in Node and any bundler that handles ES modules.

Also pairs with [`@fineanmol/holiday-optimizer`](https://www.npmjs.com/package/@fineanmol/holiday-optimizer) if you want the full PTO planning tool.

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

- **`listRegions()`** — returns `{ id, name }[]` for all supported regions
- **`holidaysInYear(regionId, year)`** — all holidays for that region/year as `{ date, name }[]`
- **`isHoliday(date, regionId)`** — `true`/`false`; `date` can be a `Date` or `'YYYY-MM-DD'` string
- **`holidayOn(date, regionId)`** — the holiday object if that day is one, otherwise `null`
- **`nextHoliday(fromDate, regionId)`** — next holiday on or after that date
- **`previousHoliday(fromDate, regionId)`** — last holiday on or before that date
- **`toISODate(date)`** — converts a `Date` to `'YYYY-MM-DD'` using the local calendar day

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

## Note

Holiday rules change year to year. This is good for apps and scheduling — don't rely on it for payroll or compliance without checking official sources.

## License

MIT

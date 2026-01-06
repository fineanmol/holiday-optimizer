class Day {
  constructor({ date, isWeekend, isPublicHoliday, isCompanyDay }) {
    this.date = date;
    this.is_weekend = isWeekend;
    this.is_public_holiday = isPublicHoliday;
    this.is_company_day = isCompanyDay;

    this.is_pto = false;
    this.is_part_of_break = false;
  }
}

class Break {
  constructor({
    start_date,
    end_date,
    total_days,
    pto_days,
    weekends,
    public_holidays,
    company_days,
    days,
  }) {
    this.start_date = start_date;
    this.end_date = end_date;
    this.total_days = total_days;
    this.pto_days = pto_days;
    this.weekends = weekends;
    this.public_holidays = public_holidays;
    this.company_days = company_days;
    this.days = days;
  }
}

class Stats {
  constructor({
    total_days_off,
    total_paid_leave,
    total_public_holidays,
    total_weekends,
    total_company_days,
  }) {
    this.total_days_off = total_days_off;
    this.total_paid_leave = total_paid_leave;
    this.total_public_holidays = total_public_holidays;
    this.total_weekends = total_weekends;
    this.total_company_days = total_company_days;
  }
}

class Result {
  constructor({ days, breaks, stats }) {
    this.days = days;
    this.breaks = breaks;
    this.stats = stats;
  }
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d, n) {
  const copy = new Date(d.getTime());
  copy.setDate(copy.getDate() + n);
  return copy;
}

function compareISO(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function isFixedOff(day) {
  return day.is_weekend || day.is_public_holiday || day.is_company_day;
}

function buildCalendar(params) {
  const yr = params.year ?? new Date().getFullYear();
  const today = new Date();

  let start;
  if (params.startDate) {
    start = parseISO(params.startDate);
  } else {
    start =
      yr === today.getFullYear()
        ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
        : new Date(yr, 0, 1);
  }
  const end = new Date(yr, 11, 31);

  const holidays = new Set((params.holidays ?? []).map((h) => h.date));
  const company = new Set((params.companyDaysOff ?? []).map((c) => c.date));

  const days = [];
  let d = start;

  while (d <= end) {
    const ds = formatDate(d);
    const weekday = d.getDay();
    const isWeekend = weekday === 0 || weekday === 6;

    days.push(
      new Day({
        date: ds,
        isWeekend,
        isPublicHoliday: holidays.has(ds),
        isCompanyDay: company.has(ds),
      })
    );

    d = addDays(d, 1);
  }

  return days;
}

function generateCandidates(cal, minLen, maxLen) {
  const candidates = [];
  const n = cal.length;

  for (let i = 0; i < n; i++) {
    for (let L = minLen; L <= maxLen; L++) {
      if (i + L > n) break;
      const seg = cal.slice(i, i + L);
      const ptoUsed = seg.reduce((acc, d) => acc + (isFixedOff(d) ? 0 : 1), 0);
      if (ptoUsed === 0) continue;

      candidates.push({
        start_idx: i,
        end_idx: i + L - 1,
        total_days: L,
        pto_used: ptoUsed,
        eff: L / ptoUsed,
        segment: seg,
      });
    }
  }

  return candidates;
}

function pruneCandidates(cands, maxPTO) {
  cands = cands.filter((c) => c.pto_used <= maxPTO);

  const byStart = new Map();
  for (const c of cands) {
    if (!byStart.has(c.start_idx)) byStart.set(c.start_idx, []);
    byStart.get(c.start_idx).push(c);
  }

  const pruned = [];
  for (const [start, items] of byStart.entries()) {
    items.sort(
      (a, b) => a.pto_used - b.pto_used || b.total_days - a.total_days
    );

    const best = [];
    for (const cand of items) {
      const dominated = best.some(
        (b) =>
          b.end_idx >= cand.end_idx &&
          b.pto_used <= cand.pto_used &&
          b.total_days >= cand.total_days
      );
      if (!dominated) best.push(cand);
    }
    pruned.push(...best);
  }

  pruned.sort((a, b) => a.start_idx - b.start_idx);
  return pruned;
}

function binarySearchNext(cands, startPos) {
  let lo = 0;
  let hi = cands.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (cands[mid].start_idx < startPos) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function dpSelect(cands, maxPTO, spacing) {
  if (!cands.length || maxPTO <= 0) return [];

  const nextIndices = cands.map((c) =>
    binarySearchNext(cands, c.end_idx + 1 + spacing)
  );
  const n = cands.length;

  const dpDays = Array.from({ length: n + 1 }, () => Array(maxPTO + 1).fill(0));
  const dpChoice = Array.from({ length: n + 1 }, () =>
    Array.from({ length: maxPTO + 1 }, () => [])
  );

  for (let idx = n - 1; idx >= 0; idx--) {
    const cand = cands[idx];
    const cost = cand.pto_used;
    const totalDays = cand.total_days;
    const jump = nextIndices[idx];

    for (let p = 0; p <= maxPTO; p++) {
      let bestDays = dpDays[idx + 1][p];
      let bestChoice = dpChoice[idx + 1][p];

      if (cost <= p) {
        const takeDays = totalDays + dpDays[jump][p - cost];
        if (takeDays > bestDays) {
          bestDays = takeDays;
          bestChoice = [idx, ...dpChoice[jump][p - cost]];
        }
      }

      dpDays[idx][p] = bestDays;
      dpChoice[idx][p] = bestChoice;
    }
  }

  const choice = dpChoice[0][maxPTO];
  return choice.map((i) => cands[i]);
}

function forceExtend(cal, breaks, remaining) {
  if (remaining <= 0) return remaining;

  for (const br of breaks) {
    const endDate = parseISO(br.end_date);
    const nextDay = addDays(endDate, 1);
    const nextISO = formatDate(nextDay);

    const idx = cal.findIndex((d) => d.date === nextISO);
    if (
      idx !== -1 &&
      remaining > 0 &&
      !cal[idx].is_part_of_break &&
      !isFixedOff(cal[idx])
    ) {
      cal[idx].is_part_of_break = true;
      cal[idx].is_pto = true;

      br.days.push(cal[idx]);
      br.end_date = cal[idx].date;
      br.total_days += 1;
      br.pto_days += 1;
      remaining -= 1;
    }
  }
  return remaining;
}

function addForcedSegments(cal, remaining) {
  const forced = [];
  let i = 0;
  const n = cal.length;

  while (i < n && remaining > 0) {
    if (cal[i].is_part_of_break || isFixedOff(cal[i])) {
      i++;
      continue;
    }

    const seg = [];
    while (
      i < n &&
      remaining > 0 &&
      !cal[i].is_part_of_break &&
      !isFixedOff(cal[i])
    ) {
      cal[i].is_part_of_break = true;
      cal[i].is_pto = true;
      seg.push(cal[i]);
      remaining--;
      i++;
    }

    if (seg.length) {
      forced.push(
        new Break({
          start_date: seg[0].date,
          end_date: seg[seg.length - 1].date,
          total_days: seg.length,
          pto_days: seg.length,
          weekends: seg.filter((d) => d.is_weekend).length,
          public_holidays: seg.filter((d) => d.is_public_holiday).length,
          company_days: seg.filter((d) => d.is_company_day).length,
          days: seg,
        })
      );
    }

    i++;
  }

  return forced;
}

function optimize(params) {
  const maxPTO = Number(params.numberOfDays);
  const minLen = params.minBreak ?? 4;
  const maxLen = params.maxBreak ?? 9;
  const spacing = params.timeBetweenBreaks ?? 21;

  const cal = buildCalendar(params);
  let candidates = generateCandidates(cal, minLen, maxLen);
  candidates = pruneCandidates(candidates, maxPTO);

  const chosen = dpSelect(candidates, maxPTO, spacing);

  const breaks = [];
  for (const seg of chosen) {
    for (let idx = seg.start_idx; idx <= seg.end_idx; idx++) {
      cal[idx].is_part_of_break = true;
      if (!isFixedOff(cal[idx])) cal[idx].is_pto = true;
    }

    const segmentDays = seg.segment;
    breaks.push(
      new Break({
        start_date: segmentDays[0].date,
        end_date: segmentDays[segmentDays.length - 1].date,
        total_days: seg.total_days,
        pto_days: seg.pto_used,
        weekends: segmentDays.filter((d) => d.is_weekend).length,
        public_holidays: segmentDays.filter((d) => d.is_public_holiday).length,
        company_days: segmentDays.filter((d) => d.is_company_day).length,
        days: [...segmentDays],
      })
    );
  }

  let usedPTO = breaks.reduce((acc, b) => acc + b.pto_days, 0);
  let remaining = maxPTO - usedPTO;

  let prevRemaining = remaining + 1;
  while (remaining > 0 && remaining < prevRemaining) {
    prevRemaining = remaining;
    remaining = forceExtend(cal, breaks, remaining);

    const extra = addForcedSegments(cal, remaining);
    breaks.push(...extra);

    usedPTO = breaks.reduce((acc, b) => acc + b.pto_days, 0);
    remaining = maxPTO - usedPTO;
  }

  const stats = new Stats({
    total_days_off: breaks.reduce((acc, b) => acc + b.total_days, 0),
    total_paid_leave: breaks.reduce((acc, b) => acc + b.pto_days, 0),
    total_public_holidays: breaks.reduce(
      (acc, b) => acc + b.public_holidays,
      0
    ),
    total_weekends: breaks.reduce((acc, b) => acc + b.weekends, 0),
    total_company_days: breaks.reduce((acc, b) => acc + b.company_days, 0),
  });

  return new Result({ days: cal, breaks, stats });
}

function formatReport(res, params) {
  const lines = [];
  lines.push("Holiday Optimizer Report (JavaScript)");
  lines.push("=====================================");
  lines.push(`Year: ${params.year ?? new Date().getFullYear()}`);
  lines.push(`Requested Paid Leave Days: ${params.numberOfDays}`);
  lines.push("");

  lines.push("Summary");
  lines.push("-------");
  lines.push(`Total Days Off: ${res.stats.total_days_off}`);
  lines.push(`Total Paid Leave Used: ${res.stats.total_paid_leave}`);
  lines.push(`Public Holidays in Breaks: ${res.stats.total_public_holidays}`);
  lines.push(`Weekends in Breaks: ${res.stats.total_weekends}`);
  if (res.stats.total_company_days > 0) {
    lines.push(`Company Days in Breaks: ${res.stats.total_company_days}`);
  }
  lines.push("");

  lines.push("Breaks");
  lines.push("------");
  if (!res.breaks.length) {
    lines.push("No breaks were scheduled.");
  } else {
    res.breaks.forEach((br, idx) => {
      const companyPart = br.company_days
        ? ` | Company ${br.company_days}`
        : "";
      lines.push(`Break ${idx + 1}: ${br.start_date} → ${br.end_date}`);
      lines.push(
        `  • Total ${br.total_days} days | Paid Leave ${br.pto_days} | ` +
          `Weekends ${br.weekends} | Public ${br.public_holidays}${companyPart}`
      );

      const ptoDates = br.days.filter((d) => d.is_pto).map((d) => d.date);
      if (ptoDates.length) {
        lines.push(`  • Paid leave dates: ${ptoDates.join(", ")}`);
      }
      lines.push("");
    });
  }

  const ptoFlat = res.days.filter((d) => d.is_pto).map((d) => d.date);
  lines.push("Paid Leave Dates (all)");
  lines.push("----------------------");
  lines.push(ptoFlat.length ? ptoFlat.join(", ") : "None");

  return lines.join("\n");
}

export { optimize, formatReport };

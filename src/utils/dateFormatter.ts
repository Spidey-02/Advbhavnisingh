/**
 * Universal Date Formatter for Bhavni Singh & Associates
 * Enforces DD/MM/YYYY format across all pages, components, and data exports.
 */

const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

const pad2 = (n: number | string): string => {
  const s = String(n).trim();
  return s.length === 1 ? `0${s}` : s;
};

/**
 * Converts any date string, Date instance, or timestamp to strict "DD/MM/YYYY" format.
 * Examples:
 * - "18 Sep 2026" -> "18/09/2026"
 * - "2026-08-17" -> "17/08/2026"
 * - "Aug 05, 2026" -> "05/08/2026"
 * - "24.08.2026" -> "24/08/2026"
 * - "18/9/2026" -> "18/09/2026"
 * - new Date() -> "17/08/2026"
 */
export const formatDateToDDMMYYYY = (input: unknown): string => {
  if (!input) return getTodayDDMMYYYY();

  if (input instanceof Date) {
    if (isNaN(input.getTime())) return getTodayDDMMYYYY();
    const day = pad2(input.getDate());
    const month = pad2(input.getMonth() + 1);
    const year = input.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const raw = String(input).trim();
  if (!raw) return getTodayDDMMYYYY();

  // Already DD/MM/YYYY or D/M/YYYY
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return `${pad2(slashMatch[1])}/${pad2(slashMatch[2])}/${slashMatch[3]}`;
  }

  // DD-MM-YYYY or DD.MM.YYYY
  const dashDotMatch = raw.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/);
  if (dashDotMatch) {
    return `${pad2(dashDotMatch[1])}/${pad2(dashDotMatch[2])}/${dashDotMatch[3]}`;
  }

  // YYYY-MM-DD (e.g. ISO format or HTML date picker)
  const isoMatch = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    return `${pad2(isoMatch[3])}/${pad2(isoMatch[2])}/${isoMatch[1]}`;
  }

  // "18 Sep 2026" or "18 September 2026" or "18-Sep-2026"
  const dayMonthYearMatch = raw.match(/^(\d{1,2})[\s\-]+([a-zA-Z]+)[\s,.\-]+(\d{4})$/);
  if (dayMonthYearMatch) {
    const day = pad2(dayMonthYearMatch[1]);
    const monthKey = dayMonthYearMatch[2].toLowerCase();
    const monthNum = MONTH_MAP[monthKey];
    const year = dayMonthYearMatch[3];
    if (monthNum) {
      return `${day}/${pad2(monthNum)}/${year}`;
    }
  }

  // "Sep 18, 2026" or "August 05, 2026"
  const monthDayYearMatch = raw.match(/^([a-zA-Z]+)[\s\-]+(\d{1,2})[\s,.\-]+(\d{4})$/);
  if (monthDayYearMatch) {
    const monthKey = monthDayYearMatch[1].toLowerCase();
    const monthNum = MONTH_MAP[monthKey];
    const day = pad2(monthDayYearMatch[2]);
    const year = monthDayYearMatch[3];
    if (monthNum) {
      return `${day}/${pad2(monthNum)}/${year}`;
    }
  }

  // Fallback to Date.parse
  try {
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      const day = pad2(parsed.getDate());
      const month = pad2(parsed.getMonth() + 1);
      const year = parsed.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // fallback
  }

  return raw;
};

/**
 * Returns today's date formatted strictly as DD/MM/YYYY
 */
export const getTodayDDMMYYYY = (): string => {
  const now = new Date();
  const day = pad2(now.getDate());
  const month = pad2(now.getMonth() + 1);
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parses DD/MM/YYYY into a standard JavaScript Date object
 */
export const parseDDMMYYYYToDate = (ddmmyyyy: string): Date => {
  if (!ddmmyyyy) return new Date();
  const match = ddmmyyyy.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  const fallback = new Date(ddmmyyyy);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
};

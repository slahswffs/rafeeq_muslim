// Hijri Date Calculation Service with adjustment support

const ISLAMIC_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export interface HijriDateInfo {
  day: number;
  month: number; // 1-12
  monthName: string;
  year: number;
  weekdayName: string;
  formatted: string;
  gregorianFormatted: string;
}

export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): HijriDateInfo {
  const adjustedDate = new Date(date);
  if (adjustmentDays !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + adjustmentDays);
  }

  // Use Intl.DateTimeFormat with islamic-umalqura if supported
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    });

    const parts = formatter.formatToParts(adjustedDate);
    let day = 1;
    let month = 1;
    let year = 1447;
    let weekdayName = ARABIC_WEEKDAYS[adjustedDate.getDay()];

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10) || 1;
      if (part.type === 'month') month = parseInt(part.value, 10) || 1;
      if (part.type === 'year') year = parseInt(part.value, 10) || 1447;
      if (part.type === 'weekday') weekdayName = part.value;
    }

    // Safety fallback for month index
    const monthIndex = Math.min(Math.max(month - 1, 0), 11);
    const monthName = ISLAMIC_MONTHS[monthIndex];

    const gregFormatter = new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return {
      day,
      month,
      monthName,
      year,
      weekdayName,
      formatted: `${weekdayName}، ${day} ${monthName} ${year} هـ`,
      gregorianFormatted: gregFormatter.format(adjustedDate),
    };
  } catch {
    // Tabular Islamic calendar fallback
    const gregDay = adjustedDate.getDate();
    const gregMonth = adjustedDate.getMonth();
    const gregYear = adjustedDate.getFullYear();

    let m = gregMonth + 1;
    let y = gregYear;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + gregDay + b - 1524;

    const epoch = 1948439.5;
    const l = jd - epoch;
    const n = Math.floor((30 * l + 10646) / 10631);
    const j = jd - Math.floor((10631 * n + 5844) / 30) + 1;
    const month = Math.min(Math.floor((11 * j + 330) / 325), 12);
    const day = j - Math.floor((325 * month - 320) / 11);
    const year = n + 1;

    const weekdayName = ARABIC_WEEKDAYS[adjustedDate.getDay()];
    const monthName = ISLAMIC_MONTHS[month - 1] || 'رمضان';

    return {
      day: day > 0 ? day : 1,
      month,
      monthName,
      year,
      weekdayName,
      formatted: `${weekdayName}، ${day} ${monthName} ${year} هـ`,
      gregorianFormatted: `${gregDay} / ${gregMonth + 1} / ${gregYear} م`,
    };
  }
}

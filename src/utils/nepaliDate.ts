import { days } from '@/constants/days'
import { months } from '@/constants/months'
import { weekDays } from '@/constants/weekDays'
import { yearsWithDaysInMonth } from '@/constants/yearsWithDaysInMonth'
import { dayjs } from '@/plugins/dayjs'
import { Language } from '@/types/Language'
import { Day, Month, NepaliDate, Year } from '@/types/NepaliDate'
import { WeekDay } from '@/types/WeekDay'

import {
  addLeadingNepaliZero,
  addLeadingZero,
  convertToNepaliDigit,
} from './digit'

const GREGORIAN_START_YEAR = 1943 // Start year of the Gregorian calendar
const NEPALI_START_YEAR = 2000 // Start year of the Nepali calendar
const NEPALI_END_YEAR = 2089 // End year of the Nepali calendar
const NEPALI_YEAR_OFFSET = NEPALI_START_YEAR - GREGORIAN_START_YEAR // Convert Gregorian year to Nepali year
const NEPALI_MONTH_OFFSET = 8 // Add an offset of 8 to convert Gregorian month to Nepali month
const NEPALI_DATE_OFFSET = 15 // Add an offset of 15 to convert Gregorian date to Nepali date
const NEPALI_MONTHS_IN_YEAR = 12 // Number of months in a year

export const YEAR_MONTH_DATE_SEPARATOR = '/' // Separator between year, month and date

const years = generateYears(NEPALI_START_YEAR, NEPALI_END_YEAR)

export const getCurrentNepaliDate = (lang: Language = 'ne'): NepaliDate => {
  const date = dayjs()

  const localizedDate = date
    .tz('Asia/Kathmandu')
    .format(`YYYY${YEAR_MONTH_DATE_SEPARATOR}MM${YEAR_MONTH_DATE_SEPARATOR}DD`)

  const [currentYear, currentMonth, currentDate] = localizedDate
    .split(YEAR_MONTH_DATE_SEPARATOR)
    .map((item) => parseInt(item, 10))

  let nepaliYear = currentYear + NEPALI_YEAR_OFFSET
  let nepaliMonth = currentMonth + NEPALI_MONTH_OFFSET
  let nepaliDate = currentDate + NEPALI_DATE_OFFSET

  const days = yearsWithDaysInMonth as unknown as {
    [year: number]: {
      daysInMonth: [number, number, number][]
    }
  }
  const nepaliDaysInMonth = days[nepaliYear].daysInMonth.map((day) => {
    if (typeof day === 'number') {
      return day
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, daysInMonth, __] = day

    return daysInMonth
  })

  // Adjust Nepali month and year if it exceeds the maximum values
  if (nepaliMonth > NEPALI_MONTHS_IN_YEAR) {
    nepaliMonth -= NEPALI_MONTHS_IN_YEAR
  }

  // Adjust Nepali date and month if it exceeds the maximum values
  if (nepaliDate > nepaliDaysInMonth[nepaliMonth - 1]) {
    nepaliDate -= nepaliDaysInMonth[nepaliMonth - 1]
    nepaliMonth += 1
  }

  // Adjust Nepali month and year if it exceeds the maximum values
  if (nepaliMonth > NEPALI_MONTHS_IN_YEAR) {
    nepaliMonth -= NEPALI_MONTHS_IN_YEAR
    nepaliYear += 1
  }

  return {
    year: {
      value: nepaliYear,
      label:
        lang === 'ne'
          ? convertToNepaliDigit(nepaliYear)
          : nepaliYear.toString(),
    },
    month: {
      value: nepaliMonth - 1,
      label: getMonthLabel(lang, nepaliMonth - 1) ?? '',
    },
    date: {
      id: `${nepaliYear}${YEAR_MONTH_DATE_SEPARATOR}${
        nepaliMonth - 1
      }${YEAR_MONTH_DATE_SEPARATOR}${nepaliDate}`,
      value: nepaliDate,
      label:
        lang === 'ne'
          ? convertToNepaliDigit(nepaliDate)
          : nepaliDate.toString(),
    },
  }
}

export const getYears = (lang: Language): Year[] => {
  return years.map((year) => {
    if (lang === 'ne') {
      return {
        value: year.value,
        label: year.label.ne,
      }
    }

    return {
      value: year.value,
      label: year.label.en,
    }
  })
}

function generateYears(startYear: number, endYear: number) {
  const years: {
    label: {
      ne: string
      en: string
    }
    value: number
    daysInMonth: [number, number, number][]
  }[] = []

  const days = yearsWithDaysInMonth as unknown as {
    [year: number]: {
      daysInMonth: [number, number, number][]
    }
  }

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      label: {
        ne: convertToNepaliDigit(year),
        en: year.toString(),
      },
      value: year,
      daysInMonth: days[year].daysInMonth,
    })
  }

  return years
}

export const getMonths = (lang: Language, short = false): Month[] => {
  return months.map((month) => {
    if (lang === 'ne') {
      return {
        value: month.value.en,
        label: short ? month.label.ne.short : month.label.ne.long,
      }
    }

    return {
      value: month.value.en,
      label: short ? month.label.en.short : month.label.en.long,
    }
  })
}

export const getMonthLabel = (
  lang: Language,
  month?: number,
  short = false,
): string | null => {
  if (typeof month === 'undefined') {
    return null
  }

  const m = month > 0 ? month - 1 : month
  if (lang === 'ne') {
    return short ? months[m].label.ne.short : months[m].label.ne.long
  }

  return short ? months[m].label.en.short : months[m].label.en.long
}

export const getMonthDatesByYear = ({
  year,
  month,
  lang = 'ne',
}: {
  year: number
  month: number
  lang?: Language
}): Array<Day> => {
  return getDatesInMonthByYear(year, month).map((date) => {
    if (lang === 'ne') {
      return {
        id: date.id,
        value: date.value,
        label: convertToNepaliDigit(date.value),
        currentMonth: date.currentMonth,
      }
    }

    return {
      id: date.id,
      value: date.value,
      label: date.value.toString(),
      currentMonth: date.currentMonth,
    }
  })
}

const getDatesInMonthByYear = (year: number, month: number) => {
  const prevMonth = month - 1 < 0 ? 11 : month - 1

  const prevMonthDates = years.find((y) => y.value === year)?.daysInMonth[
    prevMonth
  ]
  const currentMonthDates = years.find((y) => y.value === year)?.daysInMonth[
    month
  ]

  if (!prevMonthDates || !currentMonthDates) {
    return []
  }

  const dates: Array<{
    id: string
    value: number
    currentMonth: boolean
  }> = []

  if (typeof currentMonthDates === 'number') {
    for (let date = 1; date <= currentMonthDates; date++) {
      dates.push({
        id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${month}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
        value: date,
        currentMonth: true,
      })
    }

    return dates
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prevMonthDays, __] = prevMonthDates
  const [beginningMonthOffset, currentMonthDays, endMonthOffset] =
    currentMonthDates

  for (
    let date = prevMonthDays - beginningMonthOffset + 1;
    date <= prevMonthDays;
    date++
  ) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${prevMonth}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
      currentMonth: false,
    })
  }

  for (let date = 1; date <= currentMonthDays; date++) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${month}${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
      currentMonth: true,
    })
  }

  for (let date = 1; date <= endMonthOffset; date++) {
    dates.push({
      id: `${year}${YEAR_MONTH_DATE_SEPARATOR}${
        month + 1
      }${YEAR_MONTH_DATE_SEPARATOR}${date}`,
      value: date,
      currentMonth: false,
    })
  }

  return dates
}

export const getWeekDays = (lang: Language, short = true): WeekDay[] => {
  return weekDays.map((day) => {
    if (lang === 'ne') {
      return {
        value: day.value,
        label: short ? day.label.ne.short : day.label.ne.long,
      }
    }

    return {
      value: day.value,
      label: short ? day.label.en.short : day.label.en.long,
    }
  })
}

export const validateDate = (
  value: string,
  lang = 'ne',
  shortMonth = false,
): {
  valid: boolean
  value?: NepaliDate
} => {
  if (lang === 'ne') {
    const [year, month, date] = value.split(YEAR_MONTH_DATE_SEPARATOR)

    if (!year || !month || !date) {
      return {
        valid: false,
      }
    }

    const foundYear = years.find((y) => y.label[lang] === year)

    if (!foundYear) {
      return {
        valid: false,
      }
    }

    const foundMonth = months.find(
      (m) => addLeadingNepaliZero(m.value.en + 1) === month,
    )
    if (!foundMonth) {
      return {
        valid: false,
      }
    }

    const foundDate = days.find((d) => d.label.ne === date)

    if (!foundDate) {
      return {
        valid: false,
      }
    }

    return {
      valid: true,
      value: {
        year: {
          label: foundYear.label.ne,
          value: foundYear.value,
        },
        month: {
          value: foundMonth.value.en + 1,
          label: shortMonth
            ? foundMonth.label.ne.short
            : foundMonth.label.ne.long,
        },
        date: {
          id: `${foundYear.value}${YEAR_MONTH_DATE_SEPARATOR}${foundMonth.value.en}${YEAR_MONTH_DATE_SEPARATOR}${foundDate.value}`,
          value: foundDate.value,
          label: foundDate.label.ne,
        },
      },
    }
  }

  const [year, month, date] = value.split(YEAR_MONTH_DATE_SEPARATOR)

  const foundYear = years.find((y) => y.label.en === year)
  const foundMonth = months.find(
    (m) => addLeadingZero(m.value.en + 1) === month,
  )

  const foundDate = days.find((d) => d.label.en === date)

  if (!foundYear || !foundMonth || !foundDate) {
    return {
      valid: false,
    }
  }

  return {
    valid: true,
    value: {
      year: {
        label: foundYear.label.en,
        value: foundYear.value,
      },
      month: {
        value: foundMonth.value.en + 1,
        label: shortMonth
          ? foundMonth.label.en.short
          : foundMonth.label.en.long,
      },
      date: {
        id: `${foundYear.value}${YEAR_MONTH_DATE_SEPARATOR}${foundMonth.value.en}${YEAR_MONTH_DATE_SEPARATOR}${foundDate.value}`,
        value: foundDate.value,
        label: foundDate.label.en,
      },
    },
  }
}

export const formatNepaliDate = (date: NepaliDate, lang: Language) => {
  const format = `YYYY${YEAR_MONTH_DATE_SEPARATOR}MM${YEAR_MONTH_DATE_SEPARATOR}DD`

  const formattedDate = format
    .replace(
      'YYYY',
      lang === 'ne' ? date.year.label : date.year.value.toString(),
    )
    .replace(
      'MM',
      lang == 'ne'
        ? addLeadingNepaliZero(date.month.value)
        : addLeadingZero(date.month.value),
    )
    .replace(
      'DD',
      lang == 'ne'
        ? addLeadingNepaliZero(date.date.value)
        : addLeadingZero(date.date.value),
    )

  return formattedDate
}

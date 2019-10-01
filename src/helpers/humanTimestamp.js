import { MONTHS, WEEKDAYS, DAYS } from '../config/dictionary'

const addZero = number => number.toString().padStart(2, '0')
const getTimezoneOffsetMs = () => new Date().getTimezoneOffset() * 60 * 1000
const getHour = timestamp => new Date(timestamp).getHours()
const getMinute = timestamp => new Date(timestamp).getMinutes()
const getMonth = timestamp => new Date(timestamp).getMonth()
const getDay = timestamp => new Date(timestamp).getDay()
const getDate = timestamp => new Date(timestamp).getDate()
const getFullYear = timestamp => new Date(timestamp).getFullYear()
const toTime = (date = new Date()) => new Date(date).getTime()
const toSeconds = timestamp => Math.floor((timestamp - getTimezoneOffsetMs()) / 1000) // count of seconds from 1970
const toMinutes = timestamp => Math.floor(toSeconds(timestamp) / 60) // count of minutes from 1970
const toHours = timestamp => Math.floor(toMinutes(timestamp) / 60) // count of hours from 1970
const toDays = timestamp => Math.floor(toHours(timestamp) / 24) // count of days from 1970
const toWeeks = timestamp => Math.floor((toDays(timestamp) + 3) / 7) // 1970-01-01 - Thursday (+3 days)
const getWeekDay = timestamp => getDay(timestamp) // 0 - Sunday

const month = (timestamp, lang, needFull) => MONTHS[lang][needFull ? 'full' : 'short'][getMonth(timestamp)]
const weekDay = (timestamp, lang, needFull) => WEEKDAYS[lang][needFull ? 'full' : 'short'][getWeekDay(timestamp)]
const day = (timestamp, lang) => DAYS[lang][getDate(timestamp)]

/**
 * Get specific object with date title
 * @param {number | Date } timestamp - Date
 * @param {string} lang
 * @param {boolean} needFull
 * @return {{year: string, month: string, weekDay: string, day: string, time: string}}
 */

class HumanDate {
  constructor(
    timestamp,
    lang = 'en',
    needFull = true
  ) {
    this.dateToParse = timestamp
    this.lang = lang.toUpperCase()
    this.neededParamName = ''
    this.needFull = needFull
  }

  humanDateObj(needFull) {
    const date = toTime(this.dateToParse)
    const timeString = `${addZero(getHour(date, this.lang))}:${addZero(getMinute(date, this.lang))}:00`

    return {
      day: day(date, this.lang),
      month: month(date, this.lang, needFull),
      weekDay: weekDay(date, this.lang, needFull),
      year: getFullYear(date),
      time: timeString
    }
  }

  setNeededParam(param) {
    this.neededParamName = param || 'humanDateObj'
    return this
  }

  get neededInfo() {
    const { neededParamName, needFull } = this
    if (!this[neededParamName]) throw new Error(`Param [ ${neededParamName} ] is not available`)

    return this[neededParamName](needFull)
  }
}

export { HumanDate }

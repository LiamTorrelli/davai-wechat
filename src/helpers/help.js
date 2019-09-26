/* eslint-disable no-nested-ternary */
import {
  isNil,
  isEmpty,
  groupBy,
  mapObjIndexed
} from 'ramda'

const __isObject = smth => {
  const type = typeof smth
  return type === 'function' || type === 'object' && !!smth
}
const __isArray = smth => Array.isArray(smth)
const __isString = smth => typeof smth === 'string'

const __isEmpty = smth => smth === '' || isEmpty(smth) || isNil(smth) || smth === undefined

const cleanUpSpaces = str => str.split(' ').join('')
const cleanUpFromN = str => str.split('\n').join('')
const cleanUpArray = arr => {
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i]
    if (!__isEmpty(el)) newArr.push(el)
  }
  return newArr
}

const getMaxLength = (one = 1, two = 0) => Number(one) > Number(two) ? Number(one) : Number(two)

const upTheVersion = (oldVersion, releaseType) => {
  if (!oldVersion || !releaseType) return null

  const [major, minor, patch] = oldVersion.split('.')
  const newVersion = `${major}.${(releaseType === 'feature') ? (Number(minor) + 1) : minor}.${(releaseType === 'fix') ? (Number(patch) + 1) : 0}
  `
  return cleanUpSpaces(newVersion)
}
const parseMobxObjectIntoObject = obj => mapObjIndexed((val, k) => ({ val, k }), obj)
const groupArrayByParam = (arr, params, lookingBy) => groupBy(smth => params.filter(p => p === smth[lookingBy]), arr)
const findElInArray = (array, element) => array.find(value => value === element)
const cleanDuplicates = arr => arr.filter((elem, index, self) => self.indexOf(elem))
const cleanDuplicatesByProp = (myArr, prop) => myArr.filter((obj, pos) => myArr
  .map(mapObj => mapObj[prop])
  .indexOf(obj[prop]) === pos)
// Time-related helpers
const is24passed = date => {
  const nowDate = new Date()
  const lastDate = new Date(date)
  return ((nowDate.getTime() - lastDate.getTime()) / 1000 / 60) > 1440
}
export {
  __isObject,
  __isArray,
  __isString,
  __isEmpty,
  cleanUpSpaces,
  cleanUpFromN,
  cleanUpArray,
  findElInArray,
  cleanDuplicates,
  cleanDuplicatesByProp,
  is24passed,
  upTheVersion,
  groupArrayByParam,
  parseMobxObjectIntoObject,
  getMaxLength
}

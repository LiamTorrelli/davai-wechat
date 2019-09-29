/* eslint-disable no-console */
import fs from 'fs'
import chalk from 'chalk'
import { mapObjIndexed } from 'ramda'

// Helpers
import {
  __isEmpty,
  __isArray,
  parseMobxObjectIntoObject
} from '../helpers/help'

const logAutorun = (msg = '') => {
  console.log(chalk.yellowBright.bold(`${msg} store was updated`))
}

const logError = (msg = '', err = '') => {
  const parsedError = err.toString().split('Error:').join('') || ' .!..'

  console.error(`%s ${msg}\n%s ${parsedError}\n`,
    chalk.red.bold(' ERROR'),
    chalk.bold.red('REASON'))
}
const logSuccess = (msg = '') => console.log(`%s ${msg}`, chalk.green.bold('DONE'))

const logStoreValues = (store, storeName) => {
  console.log(`\n%s[ ${storeName} ]\n`, chalk.white.bold('Logging store: '))
  mapObjIndexed((value, key) => {
    if (__isEmpty(value)) {
      return console.log(`%s EMPTY [ ${value} ]`, chalk.blue.bold(key))
    }
    if (typeof value !== 'string' && !__isArray(value)) {
      const data = parseMobxObjectIntoObject(value)
      return console.log(chalk.blue.bold(key), data)
    }
    if (typeof value !== 'string' && __isArray(value)) {
      return console.log(chalk.blue.bold(key), value, '\n')
    }

    return console.log(`%s ${value}`, chalk.blue.bold(key))
  }, store)
}

class _Errors {
  constructor() {
    process.on('uncaughtException', err => {
      fs.writeSync(
        process.stderr.fd,
        `Error .!.. \n${err.toString().split('Error: ')[1]}\n`
      )
      process.exit(1)
    })

    // process.on('warning', warning => {
    //   console.warn('!' ,warning.name)
    // })
  }
}

export {
  _Errors,
  logError,
  logSuccess,
  logAutorun,
  logStoreValues
}

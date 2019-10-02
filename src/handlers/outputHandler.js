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
  process.exit(0)
}
const logSuccess = (msg = '') => console.log(`%s ${msg}`, chalk.green.bold('DONE'))
const logInfo = (msg = '') => console.log(`\n%s ${msg}\n`, chalk.cyan.bold('STARTED'))
const logThis = (msg = '', key) => {
  console.log('\n', chalk.yellow.bold(key), '\n')
  console.log(`${msg}\n`)
}

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

    console.log('HERE', typeof value)

    return console.log(`%s ${value}`, chalk.blue.bold(key))
  }, store)
}

const logObject = obj => {
  mapObjIndexed((value, key) => {
    console.log(chalk.blue.bold(key), { value })
  }, obj)
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
  logThis,
  logInfo,
  logError,
  logObject,
  logSuccess,
  logAutorun,
  logStoreValues
}

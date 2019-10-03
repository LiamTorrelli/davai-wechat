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

const logICWT = () => {
  console.log('\n')
  console.log(chalk.bold.underline.green(' __________   ________  ___                  ___  ______________'))
  console.log(chalk.bold.underline.green('|___    ___| |   _____| \\  \\                /  / |_____    _____|'))
  console.log(chalk.bold.underline.green('    |  |     |  |        \\  \\      __      /  /        |  |'))
  console.log(chalk.bold.underline.cyan('    |  |     |  |         \\  \\    /  \\    /  /         |  |'))
  console.log(chalk.bold.underline.cyan('    |  |     |  |          \\  \\  /    \\  /  /          |  |'))
  console.log(chalk.bold.underline.blue('    |  |     |  |           \\  \\/  /\\  \\/  /           |  |'))
  console.log(chalk.bold.underline.blue(' ___|  |___  |  |_________   \\    /  \\    /            |  |'))
  console.log(chalk.bold.underline.magenta('|__________| |____________|   \\__/    \\__/             |__|'))
  console.log('\n')
}

const logFinish = (msg = '') => {
  const emptySpacingCount = msg.length / 4
  let emptySpaces = ''
  let emptySpacesPart = ''

  for (let i = 0; i <= msg.length + emptySpacingCount; i += 1) emptySpaces += '_'
  for (let i = 0; i <= emptySpacingCount / 2; i += 1) emptySpacesPart += ' '

  console.log('\n')
  console.log(chalk.green(emptySpaces), '\n')
  console.log(chalk.green.bold(`${emptySpacesPart}${msg}${emptySpacesPart}`))
  console.log(chalk.green(emptySpaces))
}

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
  logICWT,
  logThis,
  logInfo,
  logError,
  logFinish,
  logObject,
  logSuccess,
  logAutorun,
  logStoreValues
}

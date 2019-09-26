/* eslint-disable no-param-reassign */
import Listr from 'listr'
import fs from 'fs'
// Controllers
import shell from 'shelljs'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess } from '../handlers/outputHandler'

// Helpers
import { upTheVersion } from '../helpers/help'

// Stores
// import { ProjectInfoStore } from './modules/stores/projectInfo'

const WECHAT_CLI_PATH = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'

const filesToAddThenDelete = [{ fileName: 'PRODUCTION.js' }]

const filesToWrite = (oldVersion, newVersion) => [
  {
    fileName: 'app.settings.js',
    lookingFor: `const APP_VERSION = '${oldVersion}'`,
    replacement: `const APP_VERSION = '${newVersion}'`
  },
  {
    fileName: 'VERSION',
    lookingFor: oldVersion,
    replacement: newVersion
  }
]

let intermidiateStoreObject = {}

async function createFilesForProduction(projectInformation) {
  const codes = []
  const { projectDirectory } = projectInformation

  filesToAddThenDelete.forEach(file => {
    const { code } = shell.touch(`${projectDirectory}/${file.fileName}`)
    codes.push(code)
  })

  return codes.filter(code => code !== 0).length === 0
}

async function loginWechatDevtools() {
  const { code } = shell.exec(`${WECHAT_CLI_PATH} -l;`, { async: false })

  return code === 0
}

async function writeVersionToFiles(projectDirectory, filesToWrite) {
  const foundTheLine = []

  const isEverythingOk = filesToWrite.map(file => {
    const linesOfAFile = fs.readFileSync(`${projectDirectory}/${file.fileName}`, 'utf8').split('\n')
    const allChangedLines = []

    linesOfAFile.forEach(line => {
      if (line === `${file.lookingFor}`) {
        line = `${file.replacement}`
        foundTheLine.push(true)
      }
      allChangedLines.push(line)
      foundTheLine.push(false)
    })

    fs.writeFileSync(
      `${projectDirectory}/${file.fileName}`,
      allChangedLines.join('\n'),
      { encoding: 'utf8', flag: 'w+' }
    )

    return foundTheLine.includes(true)
  })

  return !isEverythingOk.includes(false)
}

async function updateReleaseVersion(projectInformation) {
  const { version, releaseType, projectDirectory } = projectInformation

  const newVersion = upTheVersion(version, releaseType)
  const sanitizedVersion = newVersion.split(' ').join('').split('\n').join('')

  const fileWritingResult = await writeVersionToFiles(
    projectDirectory,
    filesToWrite(version, sanitizedVersion)
  )

  if (!fileWritingResult) return false

  intermidiateStoreObject = { newVersion: sanitizedVersion }

  return true
}

async function submitWechatRelease(projectInformation) {
  const {
    releaseDescription,
    projectDirectory
  } = projectInformation
  const { newVersion } = intermidiateStoreObject

  // const { code } = shell
  //   .exec(
  //     `${WECHAT_CLI_PATH} -u "${newVersion}@${projectDirectory}" --upload-desc "${releaseDescription}"`,
  //     { async: false }
  //   )

  return code === 0
}

async function deleteProductionFiles(projectInformation) {
  const codes = []
  const { projectDirectory } = projectInformation

  filesToAddThenDelete.forEach(file => {
    const { code } = shell.rm('-rf', `${projectDirectory}/${file.fileName}`)
    codes.push(code)
  })

  return codes.filter(code => code !== 0).length === 0
}

async function test(params) {
  /* ..and some actions that modify the state */
  // ProjectInfoStore.
  // ProjectInfoStore.todos[0] = {
  //   title: 'Take a walk',
  //   completed: false
  // };

  // ProjectInfoStore.todos[0].completed = true;

  // ProjectInfoStore.allTodos.map(todo => console.log({ ...todo }))
}

export async function handleProductionFiles(projectInfo) {
  const tasksToRun = new Listr([
    {
      /**
       * 6: createFilesForProduction
       */
      task: () => test(projectInfo)
        .then(isTaskOkk => (isTaskOkk
          ? Promise.resolve(isTaskOkk)
          : Promise.reject(new Error(tasks[6].error()))
        )).catch(err => Promise.reject(new Error(tasks[6].error(err)))),
      title: tasks[6].title()
    }
    // {
    //   /**
    //    * 6: createFilesForProduction
    //    */
    //   task: () => createFilesForProduction(projectInfo)
    //     .then(isTaskOkk => (isTaskOkk
    //       ? Promise.resolve(isTaskOkk)
    //       : Promise.reject(new Error(tasks[6].error()))
    //     )).catch(err => Promise.reject(new Error(tasks[6].error(err)))),
    //   title: tasks[6].title()
    // },
    // {
    //   /**
    //    * 7: loginWechatDevtools
    //    */
    //   task: () => loginWechatDevtools()
    //     .then(isTaskOkk => (isTaskOkk
    //       ? Promise.resolve(isTaskOkk)
    //       : Promise.reject(new Error(tasks[7].error()))
    //     )).catch(err => Promise.reject(new Error(tasks[7].error(err)))),
    //   title: tasks[7].title()
    // },
    // {
    //   /**
    //    * 8: updateReleaseVersion
    //    */
    //   task: () => updateReleaseVersion(projectInfo)
    //     .then(isTaskOkk => (isTaskOkk
    //       ? Promise.resolve(isTaskOkk)
    //       : Promise.reject(new Error(tasks[8].error()))
    //     )).catch(err => Promise.reject(new Error(tasks[8].error(err)))),
    //   title: tasks[8].title()
    // },
    // {
    //   /**
    //    * 9: submitWechatRelease
    //    */
    //   task: () => submitWechatRelease(projectInfo)
    //     .then(isTaskOkk => (isTaskOkk
    //       ? Promise.resolve(isTaskOkk)
    //       : Promise.reject(new Error(tasks[9].error()))
    //     )).catch(err => Promise.reject(new Error(tasks[9].error(err)))),
    //   title: tasks[9].title()
    // }
    // {
    //   /**
    //    * 10: deleteProductionFiles
    //    */
    //   task: () => deleteProductionFiles(projectInfo)
    //     .then(isTaskOkk => (isTaskOkk
    //       ? Promise.resolve(isTaskOkk)
    //       : Promise.reject(new Error(tasks[10].error()))
    //     )).catch(err => Promise.reject(new Error(tasks[10].error(err)))),
    //   title: tasks[10].title()
    // }
  ])

  await tasksToRun.run()
  logSuccess('Handeled WeChat Devtools successfully, let\'s continue')
}

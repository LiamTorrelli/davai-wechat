// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Helpers
import { __isEmpty } from '../helpers/help'

// Stores
import {
  ProjectInfoStore,
  GitInfoStore,
  FilesInfoStore,
  ShellArgumentsStore
} from '../modules/index'

// Functions
async function checkIfFilesExist() {
  const { startupFilesExist } = FilesInfoStore.checkFilesExistance() || {}
  return startupFilesExist
}

async function checkStartUpBranch() {
  const { currentBranch } = await GitInfoStore.setCurrentBranch() || {}
  const { STARTUP_BRANCH } = await FilesInfoStore.getStartupBranch() || {}

  return currentBranch === STARTUP_BRANCH
}

async function setStatusedFiles() {
  await GitInfoStore.setStatusedFiles()

  return true
}

async function setDeveloper() {
  await GitInfoStore.setDeveloper()

  return true
}

async function checkForChanges() {
  const { statusedFiles } = await GitInfoStore
  // This is only for release action
  return __isEmpty(statusedFiles)
}

async function setProjectInfo() {
  const { actionTime } = ProjectInfoStore.setReleaseActionDate()

  const { actionType, releaseType, description } = ShellArgumentsStore

  if (actionType === 'release') {
    ProjectInfoStore.setOldVersion(FilesInfoStore.VERSION_FILE)
    ProjectInfoStore.setReleaseType(releaseType)
    ProjectInfoStore.setReleaseDescription(description)
    const { newVersion } = ProjectInfoStore.setNewVersion() || {}

    return newVersion
  }

  return actionTime
}

export async function startUpTasks() {
  logInfo('Start up tasks')

  const { actionType } = ShellArgumentsStore

  const tasksToRun = new Listr([
    { /*  ** checkIfFilesExist **  */
      task: () => taskHandler('checkIfFilesExist', checkIfFilesExist),
      title: tasks['checkIfFilesExist'].title
    },
    // { /*  ** checkStartUpBranch **  */
    //   task: () => taskHandler('checkStartUpBranch', checkStartUpBranch),
    //   title: tasks['checkStartUpBranch'].title,
    //   enabled: () => actionType === 'release' || actionType === 'create'
    // },
    // { /*  ** setStatusedFiles **  */
    //   task: () => taskHandler('setStatusedFiles', setStatusedFiles),
    //   title: tasks['setStatusedFiles'].title
    // },
    // { /*  ** checkForChanges **  */
    //   task: () => taskHandler('checkForChanges', checkForChanges),
    //   title: tasks['checkForChanges'].title,
    //   enabled: () => actionType === 'release' || actionType === 'create'
    // },
    { /*  ** setDeveloper **  */
      task: () => taskHandler('setDeveloper', setDeveloper),
      title: tasks['setDeveloper'].title
    },
    { /*  ** setProjectInfo **  */
      task: () => taskHandler('setProjectInfo', setProjectInfo),
      title: tasks['setProjectInfo'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Start up tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Start up tasks are ready, let\'s continue')
  return true
}

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

async function checkOpenReleases() {
  const { GIT_RELEASE_BRANCH_NAME_BASE } = FilesInfoStore
  return GitInfoStore.checkOpenReleases(GIT_RELEASE_BRANCH_NAME_BASE)
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
  const { statusedFiles } = GitInfoStore
  // This is only for release action
  return __isEmpty(statusedFiles)
}

async function mergeMasterBranch() {
  const { mergeStatus } = await GitInfoStore.mergeBranch('origin/master')
  // This is only for release action
  return mergeStatus
}

async function setProjectInfo() {
  const { actionTime } = ProjectInfoStore.setReleaseActionDate()

  const { actionType, releaseType, description } = ShellArgumentsStore

  if (actionType === 'release') {
    ProjectInfoStore.setOldVersion(FilesInfoStore.VERSION_FILE)
    ProjectInfoStore.setReleaseType(releaseType)
    ProjectInfoStore.setReleaseDescription(description)
    const { newVersion } = ProjectInfoStore.setNewVersion(releaseType) || {}

    return newVersion
  }

  return actionTime
}

/**
 * These are startUp tasks. What is happening here?
 ** - checkIfFilesExist ->
 *  - getting the DAVAI-CONFIG.json file [ into FilesInfoStore ]
 *  - setting STARTUP_FILES, VERSION_FILE, DEV_TOOLS_PATH [ into FilesInfoStore ]
 *
 ** - checkStartUpBranch ->
 *  - getting and setting the current branch name [ in the GitInfoStore ]
 *  - checking whether it equals STARTUP_BRANCH [ from FilesInfoStore ]
 *
 ** - checkOpenReleases ->
 *  - checking whether the repo has other open releases not merged into master
 *
 ** - setGitInfo ->
 *  - getting and setting current status and git user [ in the GitInfoStore ]
 *
 ** - setProjectInfo ->
 *  - setting
 *    : release action date
 *    : old & new versions
 *    : release type
 *    : release description [ in the ProjectInfoStore ]
 */
export async function startUpTasks() {
  logInfo('Start up tasks')

  const { actionType } = ShellArgumentsStore

  const tasksToRun = new Listr([
    { /*  ** checkIfFilesExist **  */
      task: () => taskHandler('checkIfFilesExist', checkIfFilesExist),
      title: tasks['checkIfFilesExist'].title
    },
    { /*  ** checkStartUpBranch **  */
      task: () => taskHandler('checkStartUpBranch', checkStartUpBranch),
      title: tasks['checkStartUpBranch'].title,
      enabled: () => actionType === 'release' || actionType === 'create'
    },
    { /*  ** setStatusedFiles **  */
      task: () => taskHandler('setStatusedFiles', setStatusedFiles),
      title: tasks['setStatusedFiles'].title
    },
    { /*  ** checkForChanges **  */
      task: () => taskHandler('checkForChanges', checkForChanges),
      title: tasks['checkForChanges'].title,
      enabled: () => actionType === 'release' || actionType === 'create'
    },
    { /*  ** mergeMasterBranch **  */
      task: () => taskHandler('mergeMasterBranch', mergeMasterBranch),
      title: tasks['mergeMasterBranch'].title,
      enabled: () => actionType === 'release' || actionType === 'create'
    },
    { /*  ** checkOpenReleases **  */
      task: () => taskHandler('checkOpenReleases', checkOpenReleases),
      title: tasks['checkOpenReleases'].title,
      enabled: () => false // TODO
    },
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

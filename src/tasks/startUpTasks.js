// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, _Errors, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

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

async function setGitInfo() {
  GitInfoStore.setStatusedFiles()
  GitInfoStore.setDeveloper()

  return true
}

async function setProjectInfo() {
  ProjectInfoStore.setReleaseActionDate()
  ProjectInfoStore.setOldVersion(FilesInfoStore.VERSION_FILE)

  const { releaseType, description } = ShellArgumentsStore
  ProjectInfoStore.setReleaseType(releaseType)
  ProjectInfoStore.setReleaseDescription(description)

  const { newVersion } = ProjectInfoStore.setNewVersion(releaseType) || {}

  return newVersion
}

/**
 * These are startUp tasks. What is happening here?
 ** - checkIfFilesExist ->
 *  - getting the DAVAI.json file [ into FilesInfoStore ]
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
  const tasksToRun = new Listr([
    { /*  ** checkIfFilesExist **  */
      task: () => taskHandler('checkIfFilesExist', checkIfFilesExist),
      title: tasks['checkIfFilesExist'].title
    },
    { /*  ** checkStartUpBranch **  */
      task: () => taskHandler('checkStartUpBranch', checkStartUpBranch),
      title: tasks['checkStartUpBranch'].title
    },
    // { /*  ** checkOpenReleases **  */
    //   task: () => taskHandler('checkOpenReleases', checkOpenReleases),
    //   title: tasks['checkOpenReleases'].title
    // },
    { /*  ** setGitInfo **  */
      task: () => taskHandler('setGitInfo', setGitInfo),
      title: tasks['setGitInfo'].title
    },
    { /*  ** setProjectInfo **  */
      task: () => taskHandler('setProjectInfo', setProjectInfo),
      title: tasks['setProjectInfo'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Start up tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Start up tasks are ready, let\'s continue')
  return true
}

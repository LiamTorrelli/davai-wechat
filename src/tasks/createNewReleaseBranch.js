// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import { GitInfoStore, FilesInfoStore, ShellArgumentsStore } from '../modules/index'

async function mergePreProdBranch() {
  try {
    // TODO: move master to config
    await GitInfoStore.pullBranch('master')
    const { STARTUP_BRANCH } = FilesInfoStore
    await GitInfoStore.mergeBranch(`origin/${STARTUP_BRANCH}`)
    await GitInfoStore.pushAfterMerge({ branchName: `${STARTUP_BRANCH}` })
    // This is only for release and create action
    return true
  } catch (err) { console.warn('failed:', err); return false }
}

async function gitCreateBranch() {
  const { newReleaseBranch } = ShellArgumentsStore

  await GitInfoStore.switchToNewReleaseBranch({
    newReleaseBranch
  })

  return GitInfoStore.pushAfterMerge({ branchName: `${newReleaseBranch}` })
}

/**
 * These are createReleaseBranch tasks. What is happening here?
 *
 ** - gitCreateBranch ->
 *  - getting the new version [ from ProjectInfoStore ]
 *  - setting the new version [ into GitInfoStore ]
 */
export async function createNewReleaseBranch() {
  logInfo('Create new release branch')

  const tasksToRun = new Listr([
    { /*  ** mergePreProdBranch **  */
      task: () => taskHandler('mergePreProdBranch', mergePreProdBranch),
      title: tasks['mergePreProdBranch'].title
    },
    { /*  ** gitCreateBranch **  */
      task: () => taskHandler('gitCreateBranch', gitCreateBranch),
      title: tasks['gitCreateBranch'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Create a new release branch tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Switched to a new release branch successfully, let\'s continue')
}

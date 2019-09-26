// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import { GitInfoStore, ProjectInfoStore } from '../modules/index'

async function gitCreateBranch() {
  const { newVersion } = ProjectInfoStore
  return GitInfoStore.switchToAReleaseBranch(newVersion)
}

/**
 * These are createReleaseBranch tasks. What is happening here?
 *
 ** - 5 gitCreateBranch ->
 *  - getting the new version [ from ProjectInfoStore ]
 *  - setting the new version [ into GitInfoStore ]
 */
export async function createReleaseBranch() {
  const tasksToRun = new Listr([
    { /*  ** gitCreateBranch **  */
      task: () => taskHandler(5, gitCreateBranch),
      title: tasks[5].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Create release branch tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Switched to release branch successfully, let\'s continue')
}

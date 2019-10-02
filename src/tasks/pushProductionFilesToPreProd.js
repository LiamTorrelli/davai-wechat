// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError, logInfo } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Helpers
import { __isEmpty } from '../helpers/help'

// Stores
import {
  ProjectInfoStore,
  GitInfoStore,
  FilesInfoStore
} from '../modules/index'

async function createGithubCommit() {
  await GitInfoStore.setStatusedFiles()
  const { actionTime } = ProjectInfoStore
  const { STARTUP_BRANCH } = FilesInfoStore
  const commitMsg = await GitInfoStore
    .createAutoCommitMsg({ actionTime })

  if (commitMsg && STARTUP_BRANCH) {
    try {
      await GitInfoStore.stageFiles()
      await GitInfoStore.commitChanges(commitMsg)
      await GitInfoStore.pushCommit({ branchName: STARTUP_BRANCH })

      return true
    } catch (err) { console.warn('failed:', err); return false }
  }
  return false
}

export async function pushProductionFilesToPreProd() {
  logInfo('Push production files to PRE-PROD')

  const tasksToRun = new Listr([
    { /*  ** createGithubCommit **  */
      task: () => taskHandler('createGithubCommit', createGithubCommit),
      title: tasks['createGithubCommit'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Submitting changes to GitHub failed:', err)
      process.exit(1)
    })

  logSuccess('Submitting changes to GitHub successfully, let\'s continue')
  return true
}

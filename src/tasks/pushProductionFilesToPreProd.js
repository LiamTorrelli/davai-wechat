// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Helpers
import { __isEmpty } from '../helpers/help'

// Stores
import {
  ShellArgumentsStore,
  ProjectInfoStore,
  GitInfoStore,
  FilesInfoStore
} from '../modules/index'

// async function handleReleaseAction({
//   releaseType,
//   description,
//   newVersion,
//   actionTime
// }) {
//   await GitInfoStore.setReleaseType(releaseType)
//   await GitInfoStore.createCommitMessage({
//     actionTime,
//     description,
//     newVersion
//   })

//   const { commitStatus = false } = await GitInfoStore.createCommit() || {}

//   if (commitStatus) {
//     const { GIT_RELEASE_BRANCH_NAME_BASE } = FilesInfoStore

//     // TODO: When making a release, I need to give the base + version (current branch name has to be swithed)
//     const { pushingCommitOutputMsg = false } = await GitInfoStore
//       .pushCommit(GIT_RELEASE_BRANCH_NAME_BASE) || {}

//     return pushingCommitOutputMsg
//   }

//   return logError('Cannot push commit to GIT', 'Commit problem')
// }

async function createGithubCommit() {
  await GitInfoStore.setStatusedFiles()
  const { actionTime } = ProjectInfoStore
  const { STARTUP_BRANCH } = FilesInfoStore
  const commitMsg = await GitInfoStore
    .createAutoCommitMsg({ actionTime })

  if (commitMsg && STARTUP_BRANCH) {
    await GitInfoStore.stageFiles()
    await GitInfoStore.commitChanges(commitMsg)
    await GitInfoStore.pushCommit(STARTUP_BRANCH)

    return true
  }
  return false
}

export async function pushProductionFilesToPreProd() {
  const tasksToRun = new Listr([
    { /*  ** createGithubCommit **  */
      task: () => taskHandler('createGithubCommit', createGithubCommit),
      title: tasks['createGithubCommit'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Submitting changes to GitHub failed:', err)
      process.exit(1)
    })

  logSuccess('Submitting changes to GitHub successfully, let\'s continue')
  return true
}

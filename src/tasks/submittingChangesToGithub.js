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

// async function createGithubCommit() {
//   await GitInfoStore.setStatusedFiles()

//   const { releaseType = null, description } = ShellArgumentsStore
//   const { newVersion = null, actionTime } = ProjectInfoStore

//   const commitType = (releaseType && newVersion) ? 'release' : 'commit'

//   await GitInfoStore.setCommitType(commitType)

//   if (commitType === 'release') {
//     return handleReleaseAction({
//       releaseType,
//       description,
//       newVersion,
//       actionTime
//     })
//   }

//   console.log('commitType not release is NOT READY YET')

//   return logError('Cannot create commit', 'No commit message')
// }

async function createBuildTag() {
  const { description } = ShellArgumentsStore
  const { newVersion = null } = ProjectInfoStore
  const { creatingTagOutputMsg = false } = await GitInfoStore
    .createTag(description, newVersion) || {}

  if (creatingTagOutputMsg) {
    const { GIT_RELEASE_TAG_NAME_BASE } = FilesInfoStore

    const { tagPushStatus = false } = await GitInfoStore
      .pushTag(GIT_RELEASE_TAG_NAME_BASE) || {}

    return tagPushStatus
  }

  return logError('Cannot push TAG to GIT', '.!..')
}

export async function submittingChangesToGithub() {
  const tasksToRun = new Listr([
    { /*  ** createGithubCommit **  */
      task: () => taskHandler('createGithubCommit', createGithubCommit),
      title: tasks['createGithubCommit'].title
    },
    { /*  ** createBuildTag **  */
      task: () => taskHandler('createBuildTag', createBuildTag),
      title: tasks['createBuildTag'].title
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

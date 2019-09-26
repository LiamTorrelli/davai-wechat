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
  GitInfoStore
} from '../modules/index'

async function createGithubCommit() {
  await GitInfoStore.setStatusedFiles()
  const {
    releaseType = null,
    description
  } = ShellArgumentsStore

  const { newVersion = null, releaseActionDate } = ProjectInfoStore

  const { commitMessage } = await GitInfoStore.createCommitMessage(
    releaseType,
    description,
    newVersion,
    releaseActionDate
  )

  if (commitMessage) {
    const { pushingCommitOutputMsg = false } = await GitInfoStore.pushCommit() || {}

    return pushingCommitOutputMsg
  }

  return logError('Cannot push commit to GIT', 'No commit message')
}

async function createBuildTag() {
  const { description } = ShellArgumentsStore
  const { newVersion = null } = ProjectInfoStore

  const { creatingTagOutputMsg = false } = await GitInfoStore
    .createTag(description, newVersion) || {}

  if (creatingTagOutputMsg) {
    const { tagPushStatus = false } = await GitInfoStore
      .pushTag() || {}

    return tagPushStatus
  }

  return logError('Cannot push TAG to GIT', '.!..')
}

export async function submittingChangesToGithub() {
  const tasksToRun = new Listr([
    { /*  ** createGithubCommit **  */
      task: () => taskHandler(11, createGithubCommit),
      title: tasks[11].title
    },
    { /*  ** createBuildTag **  */
      task: () => taskHandler(12, createBuildTag),
      title: tasks[12].title
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

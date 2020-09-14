// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Helpers
import { cleanUpFromN } from '../helpers/help'

// Stores
import {
  GitInfoStore,
  FilesInfoStore,
  ProjectInfoStore,
  ShellArgumentsStore
} from '../modules/index'

async function createGithubCommit() {
  const { currentBranch } = await GitInfoStore.setCurrentBranch()
  await GitInfoStore.setStatusedFiles()
  const { actionTime } = ProjectInfoStore
  const { newReleaseBranch } = ShellArgumentsStore
  const commitMsg = await GitInfoStore
    .createAutoCommitMsg({
      branchName: newReleaseBranch,
      actionTime
    })

  if (commitMsg && currentBranch) {
    try {
      await GitInfoStore.stageFiles()
      await GitInfoStore.commitChanges({ commitMessage: commitMsg })
      await GitInfoStore.pushCommit({ branchName: currentBranch })

      return true
    } catch (err) { console.warn('failed:', err); return false }
  }
  return false
}

async function updateFilesWithVersionInNewRelease() {
  const { directory, newReleaseBranch } = ShellArgumentsStore
  const { GIT_INTEGRATION_RELEASE_BRANCH_BASE: integrationBr } = FilesInfoStore

  const newVersion = cleanUpFromN(newReleaseBranch).split(`${integrationBr}-`).join('')
  // TODO
  const { replacedLine } = await FilesInfoStore.findAndChangeLineInFile({
    directory,
    findBy: '## DEVELOPMENT RELEASE-',
    fileName: 'README.md',
    replaceBy: `## DEVELOPMENT RELEASE-${newVersion}`
  })

  return replacedLine
}

async function submitAllToGithub() {
  const { currentBranch } = await GitInfoStore.setCurrentBranch()
  await GitInfoStore.setStatusedFiles()
  const { actionTime } = ProjectInfoStore
  const { newReleaseBranch } = ShellArgumentsStore
  const commitMsg = await GitInfoStore
    .createCommitMsg({
      branchName: newReleaseBranch,
      actionTime
    })

  if (commitMsg && currentBranch) {
    try {
      await GitInfoStore.stageFiles()
      await GitInfoStore.commitChanges({ commitMessage: commitMsg })
      await GitInfoStore.pushCommit({ branchName: currentBranch })

      return true
    } catch (err) { console.warn('failed:', err); return false }
  }
  return false
}

export async function submitChangesToGithub() {
  logInfo('Submit changes to github')

  const tasksToRun = new Listr([
    { /*  ** createGithubCommit **  */
      task: () => taskHandler('createGithubCommit', createGithubCommit),
      title: tasks['createGithubCommit'].title
    },
    { /*  ** updateFilesWithVersionInNewRelease **  */
      task: () => taskHandler('updateFilesWithVersionInNewRelease', updateFilesWithVersionInNewRelease),
      title: tasks['updateFilesWithVersionInNewRelease'].title
    },
    { /*  ** submitAllToGithub **  */
      task: () => taskHandler('submitAllToGithub', submitAllToGithub),
      title: tasks['submitAllToGithub'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Submit changes to github tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Submitting changes to github successfully, let\'s continue')
}

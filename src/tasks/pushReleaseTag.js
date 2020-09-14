// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  GitInfoStore,
  ProjectInfoStore,
  FilesInfoStore
} from '../modules/index'

async function gitCreateTag() {
  try {
    const { newVersion, releaseDescription } = ProjectInfoStore
    const { GIT_RELEASE_TAG_NAME_BASE } = FilesInfoStore

    GitInfoStore.createTag({
      tagNameBase: GIT_RELEASE_TAG_NAME_BASE,
      version: newVersion,
      description: releaseDescription
    })

    return true
  } catch (err) { console.warn('failed:', err); return false }
}

async function handlePushTag() {
  try {
    const { releaseTagPushed } = await GitInfoStore.pushReleaseTag()

    return releaseTagPushed
  } catch (err) { console.warn('failed:', err); return false }
}

export async function pushReleaseTag() {
  logInfo('Pushing release tag')

  const tasksToRun = new Listr([
    { /*  ** gitCreateTag **  */
      task: () => taskHandler('gitCreateTag', gitCreateTag),
      title: tasks['gitCreateTag'].title
    },
    { /*  ** handlePushTag **  */
      task: () => taskHandler('handlePushTag', handlePushTag),
      title: tasks['handlePushTag'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Pushing release tag tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Pushing release tag successfully, let\'s continue')
}

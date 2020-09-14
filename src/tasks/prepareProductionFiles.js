// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError, logInfo } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  ProjectInfoStore,
  FilesInfoStore,
  ShellArgumentsStore
} from '../modules/index'

async function updateProductionFiles() {
  const { oldVersion, newVersion } = ProjectInfoStore

  const { directory } = ShellArgumentsStore

  const { filesUpdatedWithVersion } = await FilesInfoStore.updateFilesWithVersion({
    directory,
    oldVersion,
    newVersion,
    type: 'production'
  })

  return filesUpdatedWithVersion
}

export async function prepareProductionFiles() {
  logInfo('Prepare production files')

  const tasksToRun = new Listr([
    { /*  ** updateProductionFiles **  */
      task: () => taskHandler('updateProductionFiles', updateProductionFiles),
      title: tasks['updateProductionFiles'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Preparing production files failed:', err)
      process.exit(1)
    })

  logSuccess('Handeled prepare production files successfully, let\'s continue')
  return true
}

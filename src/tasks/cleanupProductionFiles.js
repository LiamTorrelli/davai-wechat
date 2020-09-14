// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError, logInfo } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  FilesInfoStore,
  ShellArgumentsStore,
  ProjectInfoStore
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

export async function cleanupProductionFiles() {
  logInfo('Clean up production files')

  const tasksToRun = new Listr([
    { /*  ** updateProductionFiles **  */
      task: () => taskHandler('updateProductionFiles', updateProductionFiles),
      title: tasks['updateProductionFiles'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Cleaning up production files failed:', err)
      process.exit(1)
    })

  logSuccess('Cleaning up production files successfully, let\'s continue')
  return true
}

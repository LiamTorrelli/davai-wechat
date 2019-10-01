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
  ShellArgumentsStore
} from '../modules/index'

async function deleteProductionFiles() {
  const { directory } = ShellArgumentsStore
  const { productionFilesDeleted } = await FilesInfoStore
    .deleteProductionFiles(directory)

  return productionFilesDeleted
}

export async function cleanupProductionFiles() {
  logInfo('Clean up production files')

  const tasksToRun = new Listr([
    { /*  ** deleteProductionFiles **  */
      task: () => taskHandler('deleteProductionFiles', deleteProductionFiles),
      title: tasks['deleteProductionFiles'].title
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

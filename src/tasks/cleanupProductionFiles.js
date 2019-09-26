// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError } from '../handlers/outputHandler'
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
  const tasksToRun = new Listr([
    { /*  ** deleteProductionFiles **  */
      task: () => taskHandler(10, deleteProductionFiles),
      title: tasks[10].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Cleaning up production files failed:', err)
      process.exit(1)
    })

  logSuccess('Cleaning up production files successfully, let\'s continue')
  return true
}

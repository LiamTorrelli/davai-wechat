// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  ProjectInfoStore,
  FilesInfoStore,
  ShellArgumentsStore
} from '../modules/index'

async function createProductionFiles() {
  const { directory } = ShellArgumentsStore
  const {
    productionFilesAdded,
    noProductionsFilesToAdd
  } = await FilesInfoStore.addProductionFiles(directory)

  return productionFilesAdded || noProductionsFilesToAdd
}

async function updateProductionFiles() {
  const { oldVersion, newVersion } = ProjectInfoStore
  const { directory } = ShellArgumentsStore

  const { productionFilesUpdated } = await FilesInfoStore.updateProdFilesWithVersion(
    directory,
    oldVersion,
    newVersion
  )

  return productionFilesUpdated
}

export async function prepareProductionFiles() {
  const tasksToRun = new Listr([
    { /*  ** createProductionFiles **  */
      task: () => taskHandler(6, createProductionFiles),
      title: tasks[6].title
    },
    { /*  ** updateProductionFiles **  */
      task: () => taskHandler(7, updateProductionFiles),
      title: tasks[7].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Preparing production files failed:', err)
      process.exit(1)
    })

  logSuccess('Handeled prepare production files successfully, let\'s continue')
  return true
}

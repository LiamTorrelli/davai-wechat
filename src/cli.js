// Tasks
import { parseArgumentsIntoOptions } from './tasks/parseArgumentsIntoOptions'
import { promptForMissingOptions } from './tasks/promptForMissingOptions'
import { startUpTasks } from './tasks/startUpTasks'
import { createReleaseBranch } from './tasks/createReleaseBranch'
import { prepareProductionFiles } from './tasks/prepareProductionFiles'
import { handleWechatDevtools } from './tasks/handleWechatDevtools'
import { cleanupProductionFiles } from './tasks/cleanupProductionFiles'
import { submittingChangesToGithub } from './tasks/submittingChangesToGithub'

// Handlers
import {
  logError,
  logSuccess,
  _Errors,
  logStoreValues
} from './handlers/outputHandler'

export async function cli(args) {
  try {
    await parseArgumentsIntoOptions(args)
    await promptForMissingOptions()
    // await startUpTasks()
    // await prepareProductionFiles()
    // await createReleaseBranch()
    // await handleWechatDevtools()
    // await cleanupProductionFiles()
    // await submittingChangesToGithub()
    logSuccess('THE NEW VERSION IS UPLOADED TO WECHAT!')
  } catch (error) { logError(error) }
}

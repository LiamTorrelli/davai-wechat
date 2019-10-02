// Tasks
import { parseArgumentsIntoOptions } from './tasks/parseArgumentsIntoOptions'
import { promptForMissingOptions } from './tasks/promptForMissingOptions'
import { startUpTasks } from './tasks/startUpTasks'
import { createReleaseBranch } from './tasks/createReleaseBranch'
import { prepareProductionFiles } from './tasks/prepareProductionFiles'
import { pushProductionFilesToPreProd } from './tasks/pushProductionFilesToPreProd'
import { handleWechatDevtools } from './tasks/handleWechatDevtools'
import { handleWechatPreview } from './tasks/handleWechatPreview'
import { handleWechatRelease } from './tasks/handleWechatRelease'
import { pushReleaseTag } from './tasks/pushReleaseTag'
import { cleanupProductionFiles } from './tasks/cleanupProductionFiles'
import { submittingChangesToGithub } from './tasks/submittingChangesToGithub'

import { ShellArgumentsStore } from './modules/index'

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
    await startUpTasks()

    const { actionType } = await ShellArgumentsStore

    if (actionType === 'preview') {
      await handleWechatPreview()
      return logSuccess('THE NEW PREVIEW WAS GENERATED!')
    }

    if (actionType === 'release') {
      await prepareProductionFiles()
      await pushProductionFilesToPreProd()
      await createReleaseBranch()
      // await handleWechatRelease()
      await pushReleaseTag()
      // await cleanupProductionFiles()
      // await submittingChangesToGithub()
      return logSuccess('THE NEW VERSION WAS RELEASED TO WECHAT!')
    }

    return logError('DAVAI-WECHAT only supports preview|release')
  } catch (error) { console.log('!!!!!!'); logError(error) }

  return logError('How did you get here?')
}

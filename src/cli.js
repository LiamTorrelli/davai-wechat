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
import { submitChangesToGithub } from './tasks/submitChangesToGithub'
import { createNewReleaseBranch } from './tasks/createNewReleaseBranch'

import { ShellArgumentsStore, ProjectInfoStore, FilesInfoStore } from './modules/index'
import { cleanUpFromN } from './helpers/help'

// Handlers
import {
  logError,
  logFinish,
  logICWT,
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
      await handleWechatRelease()
      await pushReleaseTag()

      const { newVersion } = ProjectInfoStore
      logFinish(`RELEASE ${cleanUpFromN(newVersion)} was uploaded to Wechat`)
      logICWT()

      return logSuccess('THE NEW VERSION WAS RELEASED TO WECHAT!')
    }

    if (actionType === 'create') {
      const { newReleaseBranch } = ShellArgumentsStore
      await createNewReleaseBranch()
      await cleanupProductionFiles()
      await submitChangesToGithub()

      logFinish(`${cleanUpFromN(newReleaseBranch)} was created`)
      logICWT()

      return logSuccess('THE NEW RELEASE BRANCH WAS CREATED!')
    }

    return logError('DAVAI-WECHAT only supports preview|release|create')
  } catch (error) { console.log('Error is here'); logError(error) }

  return logError('How did you get here?')
}

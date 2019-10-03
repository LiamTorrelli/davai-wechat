// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  ProjectInfoStore,
  FilesInfoStore,
  ShellArgumentsStore,
  WechatStore
} from '../modules/index'

async function loginWechatDevtools() {
  const { DEV_TOOLS_PATH } = FilesInfoStore
  const { directory } = ShellArgumentsStore

  if (!DEV_TOOLS_PATH) throw new Error('DEV_TOOLS_PATH was not found')

  const { isLoggedIn } = await WechatStore.loginIntoWechat({ DEV_TOOLS_PATH, directory })

  return isLoggedIn
}

async function generateWechatRelease() {
  const { DEV_TOOLS_PATH } = FilesInfoStore
  const { directory } = ShellArgumentsStore
  const { newVersion, releaseDescription } = ProjectInfoStore

  if (!DEV_TOOLS_PATH) throw new Error('DEV_TOOLS_PATH was not found')

  const { isReleaseGenerated } = await WechatStore
    .generateRelease({
      DEV_TOOLS_PATH,
      directory,
      newVersion,
      releaseDescription
    })

  return isReleaseGenerated
}

export async function handleWechatRelease() {
  logInfo('Handle WeChat release')

  const tasksToRun = new Listr([
    { /*  ** loginWechatDevtools **  */
      task: () => taskHandler('loginWechatDevtools', loginWechatDevtools),
      title: tasks['loginWechatDevtools'].title
    },
    { /*  ** generateWechatRelease **  */
      task: () => taskHandler('generateWechatRelease', generateWechatRelease),
      title: tasks['generateWechatRelease'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Handling Wechat Devtools failed:', err)
      process.exit(1)
    })

  logSuccess('Handeled WeChat Devtools successfully, let\'s continue')
  return true
}

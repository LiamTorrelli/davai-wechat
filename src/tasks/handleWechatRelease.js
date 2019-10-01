// Libs
import Listr from 'listr'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, _Errors, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

// Stores
import {
  ProjectInfoStore,
  GitInfoStore,
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

async function generateWechatPreview() {
  const { DEV_TOOLS_PATH } = FilesInfoStore
  const {
    directory,
    taskName,
    pagePath,
    pageQueryParams
  } = ShellArgumentsStore
  const { releaseActionDate } = ProjectInfoStore
  const { developer } = GitInfoStore

  if (!DEV_TOOLS_PATH) throw new Error('DEV_TOOLS_PATH was not found')

  const { isPreviewGenerated } = await WechatStore
    .generatePreview({
      DEV_TOOLS_PATH,
      directory,
      releaseActionDate,
      taskName,
      pagePath,
      pageQueryParams,
      developer
    })

  return isPreviewGenerated
}

export async function handleWechatRelease() {
  const tasksToRun = new Listr([
    // { /*  ** loginWechatDevtools **  */
    //   task: () => taskHandler('loginWechatDevtools', loginWechatDevtools),
    //   title: tasks['loginWechatDevtools'].title
    // },
    { /*  ** generateWechatPreview **  */
      task: () => taskHandler('generateWechatPreview', generateWechatPreview),
      title: tasks['generateWechatPreview'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n')
      logError('Handling Wechat Devtools failed:', err)
      process.exit(1)
    })

  logSuccess('Handeled WeChat Devtools successfully, let\'s continue')
  return true
}
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
  const { directory } = ShellArgumentsStore
  const { releaseActionDate } = ProjectInfoStore

  if (!DEV_TOOLS_PATH) throw new Error('DEV_TOOLS_PATH was not found')

  const { isPreviewGenerated } = await WechatStore
    .generatePreview({ DEV_TOOLS_PATH, directory, releaseActionDate })

  return isPreviewGenerated
}

// async function submitWechatRelease(projectInformation) {
//   const {
//     version,
//     releaseType,
//     releaseDescription,
//     releaseActionDate,
//     projectDirectory
//   } = projectInformation

//   console.log('version', version)
//   console.log('projectDirectory', projectDirectory)
// const { code } = shell
//   .exec(
//     `${WECHAT_CLI_PATH} -u "${newVersion}@${projectDirectory}" --upload-desc "${releaseDescription}"`,
//     { async: false }
//   )
//   console.log('releaseDescription', releaseDescription)
//   // const { code } = shell
//   //   .exec(
//   //     '/Applications/wechatwebdevtools.app/Contents/MacOS/cli -l;',
//   //     { async: false }
//   //   )

//   // return code === 0
// }

export async function handleWechatPreview() {
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

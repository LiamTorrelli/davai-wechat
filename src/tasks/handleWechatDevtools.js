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

  if (!DEV_TOOLS_PATH) throw new Error('DEV_TOOLS_PATH was not found')

  const { isLoggedIn } = await WechatStore.loginIntoWechat(DEV_TOOLS_PATH)

  return isLoggedIn
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
//   // TODO
//   // const { code } = shell
//   //   .exec(
//   //     '/Applications/wechatwebdevtools.app/Contents/MacOS/cli -l;',
//   //     { async: false }
//   //   )

//   // return code === 0
// }

export async function handleWechatDevtools() {
  const tasksToRun = new Listr([
    { /*  ** loginWechatDevtools **  */
      task: () => taskHandler(6, loginWechatDevtools),
      title: tasks[6].title
    }
    /**
     * 7: submitWechatRelease
     */
    // task: () => submitWechatRelease(projectInfo)
    //   .then(isTaskOkk => (isTaskOkk
    //     ? Promise.resolve(isTaskOkk)
    //     : Promise.reject(new Error(tasks[7].error()))
    //   )).catch(err => Promise.reject(new Error(tasks[7].error(err)))),
    // title: tasks[7].title()
    // }
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

// Libs
import { observable, action, autorun } from 'mobx'
import fs from 'fs'

// Services
import { WechatService } from '../../services/wechatService'
import { FilesService } from '../../services/filesService'

// Handlers
import { logError, logAutorun, logStoreValues } from '../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../helpers/help'

export const WechatStore = observable({
  isLoggedIn: false,
  isPreviewGenerated: false,

  async loginIntoWechat(DEV_TOOLS_PATH, directory) {
    if (!DEV_TOOLS_PATH && !directory) return logError(
      'Login Wechat Devtools failed:',
      'No DEV_TOOLS_PATH or directory was provided'
    )
    try {
      const {
        code,
        ErrorMessage
      } = await new WechatService().loginWechatDevTools(DEV_TOOLS_PATH, directory)

      if (code !== 0) throw new Error(ErrorMessage)

      this.isLoggedIn = code === 0

      return this
    } catch (err) { return logError('Login Wechat Devtools failed:', err) }
  },

  async generatePreview({
    DEV_TOOLS_PATH,
    directory,
    releaseActionDate,
    taskName,
    pagePath,
    pageQueryParams,
    developer
  }) {
    // TODO: Separate the logic - too much is going on here

    if (!DEV_TOOLS_PATH
      && !directory
      && !releaseActionDate
      && !taskName
      && !pagePath
      && !pageQueryParams
      && !developer
    ) return logError(
      'Generating Wechat preview failed:',
      'No DEV_TOOLS_PATH or directory was provided'
    )
    try {
      const {
        code,
        ErrorMessage,
        pathToBase64File,
        pathToFutureImg,
        developerInfoPath,
        pathToPreviewOutput
      } = await new WechatService().generatePreview({
        DEV_TOOLS_PATH,
        directory,
        pagePath,
        pageQueryParams
      })

      if (code !== 0) throw new Error(ErrorMessage)

      const {
        day,
        month,
        year,
        time
      } = releaseActionDate

      const dateString = `${month} ${day} ${year} [${time}]`
      const base64Code = new FilesService()
        .setFilePath(`${pathToBase64File}`)
        .contents

      const previewOutputInfo = new FilesService()
        .setFilePath(`${pathToPreviewOutput}`)
        .contents

      const imgStr = `data:image/png;base64, ${base64Code}`
      fs.writeFile(
        `${pathToFutureImg}`,
        Buffer.from(imgStr.split(/,\s*/)[1].toString(), 'base64'),
        err => { if (err) throw new Error('', err) }
      )

      const developerInfo = {
        Date: dateString,
        Developer: cleanUpFromN(developer),
        Task: taskName,
        Preview: {
          Condition: {
            pathName: pagePath,
            query: pageQueryParams
          },
          ...JSON.parse(previewOutputInfo)
        }
      }

      fs.writeFile(
        developerInfoPath,
        JSON.stringify(developerInfo, null, 2),
        err => { if (err) throw new Error('', err) }
      )

      this.isPreviewGenerated = code === 0

      return this
    } catch (err) { return logError('Generating preview failed:', err) }
  }

}, {
  loginIntoWechat: action,
  generatePreview: action
})

autorun(() => {
  logAutorun('Wechat')
  // logStoreValues(WechatStore, 'WechatStore')
})

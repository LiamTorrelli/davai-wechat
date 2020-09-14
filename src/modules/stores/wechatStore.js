// Libs
import { observable, action } from 'mobx'
import fs from 'fs'

// Services
import { WechatService } from '../../services/wechatService'
import { FilesService } from '../../services/filesService'

// Handlers
import { logError } from '../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../helpers/help'

export const WechatStore = observable({
  isLoggedIn: false,
  isPreviewGenerated: false,

  async loginIntoWechat({ DEV_TOOLS_PATH }) {
    if (!DEV_TOOLS_PATH) return logError(
      'Login Wechat Devtools failed:',
      'No DEV_TOOLS_PATH was provided'
    )
    try {
      const {
        code,
        ErrorMessage
      } = await new WechatService().loginWechatDevTools({ DEV_TOOLS_PATH })

      if (code !== 0) throw new Error(ErrorMessage)

      this.isLoggedIn = code === 0

      return this
    } catch (err) { return logError('Login Wechat Devtools failed:', err) }
  },

  async generatePreview({
    DEV_TOOLS_PATH,
    directory,
    actionTime,
    taskName,
    pagePath,
    pageQueryParams,
    developer
  }) {
    // TODO: Separate the logic - too much is going on here

    if (!DEV_TOOLS_PATH
      && !directory
      && !actionTime
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
        day,
        month,
        year,
        time
      } = actionTime

      const dateString = `${month} ${day} ${year} [${time}]`

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
        Developer: cleanUpFromN(developer),
        Date: dateString,
        Task: taskName,
        Page: pagePath,
        Query: pageQueryParams,
        ...JSON.parse(previewOutputInfo)
      }

      // logObject(developerInfo)

      fs.writeFile(
        developerInfoPath,
        JSON.stringify(developerInfo, null, 2),
        err => { if (err) throw new Error('', err) }
      )

      this.isPreviewGenerated = code === 0

      return this
    } catch (err) { return logError('Generating preview failed:', err) }
  },

  async generateRelease({
    DEV_TOOLS_PATH = null,
    directory = null,
    newVersion = null,
    releaseDescription = null
  }) {
    if (!DEV_TOOLS_PATH
      && !directory
      && !newVersion
      && !releaseDescription
    ) return logError(
      'Generating Wechat release failed:',
      'No DEV_TOOLS_PATH or directory was provided'
    )
    try {
      const {
        code,
        ErrorMessage
      } = await new WechatService().generateRelease({
        DEV_TOOLS_PATH: cleanUpFromN(DEV_TOOLS_PATH),
        directory: cleanUpFromN(directory),
        newVersion: cleanUpFromN(newVersion),
        releaseDescription: cleanUpFromN(releaseDescription)
      })

      if (code !== 0) throw new Error(ErrorMessage)

      this.isReleaseGenerated = code === 0

      return this
    } catch (err) { return logError('Generating release failed:', err) }
  }

}, {
  loginIntoWechat: action,
  generatePreview: action
})

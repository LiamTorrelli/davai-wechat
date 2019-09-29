// Libs
import { observable, action, autorun } from 'mobx'
import fs from 'fs'

// Services
import { WechatService } from '../../services/wechatService'
import { FilesService } from '../../services/filesService'

// Handlers
import { logError, logAutorun, logStoreValues } from '../../handlers/outputHandler'

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

  async generatePreview({ DEV_TOOLS_PATH, directory, releaseActionDate }) {
    if (!DEV_TOOLS_PATH && !directory) return logError(
      'Generating Wechat preview failed:',
      'No DEV_TOOLS_PATH or directory was provided'
    )
    try {
      const {
        code,
        ErrorMessage
      } = await new WechatService().generatePreview({ DEV_TOOLS_PATH, directory })

      if (code !== 0) throw new Error(ErrorMessage)

      const { day, month, year } = releaseActionDate
      const dateString = `${month}-${day}-${year}`
      const base64Code = new FilesService()
        .setFilePath(`${directory}/code.txt`)
        .contents

      const imgStr = `data:image/png;base64, ${base64Code}`
      fs.writeFile(
        `${directory}/QR.jpeg`,
        Buffer.from(imgStr.split(/,\s*/)[1].toString(), 'base64'),
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

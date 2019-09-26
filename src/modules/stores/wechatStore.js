// Libs
import { observable, action, autorun } from 'mobx'
import { ShellExecutor } from '../../controllers/shellExecutor'

// Handlers
import { logError, logAutorun, logStoreValues } from '../../handlers/outputHandler'

export const WechatStore = observable({
  isLoggedIn: false,

  async loginIntoWechat(DEV_TOOLS_PATH) {
    try {
      const isSuccesful = await new ShellExecutor()
        .executeCode(`${DEV_TOOLS_PATH} -l`)

      this.isLoggedIn = isSuccesful

      return this
    } catch (err) { return logError('Logining Into Wechat failed:', err) }
  }

}, {
  loginIntoWechat: action
})

autorun(() => {
  logAutorun('Wechat')
  // logStoreValues(WechatStore, 'WechatStore')
})

// Functions
import {
  PREVIEWING,
  LOGGININGIN
} from './wechatServices'

export class WechatService {
  generatePreview(args) { return PREVIEWING.generatePreview({ ...args }) }

  loginWechatDevTools(args) { return LOGGININGIN.loginWechatDevTools({ ...args }) }
}

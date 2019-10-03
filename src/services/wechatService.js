// Functions
import {
  PREVIEWING,
  LOGGININGIN,
  RELEASING
} from './wechatServices'

export class WechatService {
  generatePreview(args) { return PREVIEWING.generatePreview(args) }

  generateRelease(args) { return RELEASING.generateRelease(args) }

  loginWechatDevTools(args) { return LOGGININGIN.loginWechatDevTools(args) }
}

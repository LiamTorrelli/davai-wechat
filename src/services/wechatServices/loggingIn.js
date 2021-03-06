// Libs
import path from 'path'
import shell from 'shelljs'

export const LOGGININGIN = {

  /**
   * Login Wechat dev tools @return {String || false}
   */
  async loginWechatDevTools({ DEV_TOOLS_PATH }) {
    const resolvedDevtoolsPath = path.resolve(DEV_TOOLS_PATH).split('\'').join('"')

    const output = shell.exec(
      `${resolvedDevtoolsPath} login`,
      { async: false }
    )

    const { stdout, stderr, code } = output
    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }

}

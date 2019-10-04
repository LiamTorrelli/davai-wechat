// Libs
import path from 'path'
import shell from 'shelljs'

export const RELEASING = {

  /**
   * Releasing in Wechat @return {String || false}
   */
  async generateRelease({
    DEV_TOOLS_PATH,
    directory,
    newVersion,
    releaseDescription
  }) {
    if (!DEV_TOOLS_PATH
     || !directory
     || !newVersion
     || !releaseDescription
    ) throw new Error('generateRelease could not find needed params')

    const resolvedDevtoolsPath = path.resolve(DEV_TOOLS_PATH).split('\'').join('"')
    const output = shell.exec(
      `${resolvedDevtoolsPath} -u ${newVersion}@${directory} --upload-desc '${releaseDescription}'`,
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

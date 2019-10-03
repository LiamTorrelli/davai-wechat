// Libs
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

    const output = shell.exec(
      `${DEV_TOOLS_PATH} -u ${newVersion}@${directory} --upload-desc '${releaseDescription}'`,
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

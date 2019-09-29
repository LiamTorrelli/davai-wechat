// Libs
import shell from 'shelljs'

export const PREVIEWING = {

  /**
   * Getting current git branch @return {String || false}
   */
  async generatePreview({ DEV_TOOLS_PATH, directory }) {
    const previewBaseAction = `"${DEV_TOOLS_PATH}" --preview ${directory}`
    const outputInfoAction = `--preview-info-output ${directory}/preview-info-output.json`
    const outputQrInfo = `--preview-qr-output base64@/${directory}/code.txt`

    const output = shell.exec(
      `${previewBaseAction} ${outputInfoAction} ${outputQrInfo}`,
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

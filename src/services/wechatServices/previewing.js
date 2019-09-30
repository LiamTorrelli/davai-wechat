// Libs
import path from 'path'
import shell from 'shelljs'

export const PREVIEWING = {
  // TODO - ING
  // const previewBaseAction = `c:/"Program Files (x86)"/Tencent/微信web开发者工具/cli.bat --preview ${directory}`
  /**
   * Getting current git branch @return {String || false}
   */
  async generatePreview({
    DEV_TOOLS_PATH,
    directory,
    pagePath,
    pageQueryParams
  }) {
    const previewBaseAction = `${path.resolve(DEV_TOOLS_PATH)} --preview ${path.resolve(directory)}`
    const pathToPreviewOutput = `${path.resolve(directory, 'DAVAI-INFO/preview-info-output.json')}`
    const developerInfoPath = `${path.resolve(directory, 'DAVAI-INFO/preview-params.json')}`

    const compileCondition = `--compile-condition '{"pathName":"${pagePath}","query":"${pageQueryParams}"}'`

    const output = shell.exec(
      `${previewBaseAction} --preview-info-output ${pathToPreviewOutput} ${compileCondition}`,
      { async: false }
    )

    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code,
      developerInfoPath,
      pathToPreviewOutput
    }
  }

}

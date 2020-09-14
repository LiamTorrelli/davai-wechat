// Services
import { DavaiCommit } from 'davai-commit'

// Handlers
import { logError } from '../../../handlers/outputHandler'

export const SETTING = {

  async setStatusedFiles() {
    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().getGitStatus()
      if (code !== 0) throw new Error(ErrorMessage)

      this.statusedFiles = result
      return this
    } catch (err) { return logError('Setting status files failed:', err) }
  },

  async setDeveloper() {
    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().getGitUserName()

      if (code !== 0) throw new Error(ErrorMessage)

      this.developer = result
      return this
    } catch (err) { return logError('Setting developer failed:', err) }
  },

  async setReleaseType(releaseType) {
    if (!releaseType) return logError('Setting commit type failed:', 'No commit type specified')

    this.releaseType = releaseType

    return this
  }

}

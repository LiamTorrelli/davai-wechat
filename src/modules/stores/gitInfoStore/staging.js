// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

export const STAGING = {

  async stageFiles() {
    try {
      const {
        code,
        ErrorMessage
      } = await new GitService().addFilesToGitStage()

      if (code !== 0) throw new Error(ErrorMessage)

      return this
    } catch (err) { return logError('Staging files failed:', err) }
  }

}

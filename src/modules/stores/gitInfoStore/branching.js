// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const BRANCHING = {

  async setCurrentBranch() {
    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new GitService().getCurrentBranch()

      if (code !== 0) throw new Error(ErrorMessage)

      this.currentBranch = cleanUpFromN(result)
      return this
    } catch (err) { return logError('Setting current branch failed:', err) }
  },

  async switchToAReleaseBranch(branchBase, version) {
    try {
      const branchName = `${branchBase}-${version}`
      const {
        result,
        code,
        ErrorMessage
      } = await new GitService().createBranch(branchName)

      if (code !== 0) throw new Error(ErrorMessage)

      this.currentBranch = cleanUpFromN(result)
      return this
    } catch (err) { return logError('Switching To A Release Branch failed:', err) }
  }

}

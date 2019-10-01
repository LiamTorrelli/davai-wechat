// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const PUSHING = {
  async pushCommit(branchName) {
    try {
      const {
        code,
        ErrorMessage
      } = await new GitService().pushCommit(cleanUpFromN(branchName))

      if (code !== 0) throw new Error(ErrorMessage)

      return this
    } catch (err) { return logError('Staging files failed:', err) }
  },

  async pushTag(tagNameBase) {
    const { tagName = null } = this
    if (!tagName || !tagNameBase) return logError('Pushing Tag failed:', 'No tagname was provided')

    try {
      const pushStatus = await new GitService()
        .handlePushTag(`${tagNameBase}-${tagName}`)

      this.tagPushStatus = pushStatus

      return this
    } catch (err) { return logError('Pushing Tag failed:', err) }
  }

}

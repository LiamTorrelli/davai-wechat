// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const TAGGING = {

  async createTag(description, version) {
    if (!description || !version) return logError('Creating Tag failed:', 'No description or version')

    try {
      const tagName = `${cleanUpFromN(version)}`

      const tagCreated = await new GitService()
        .handleCreateGitTag(cleanUpFromN(description), tagName)

      this.creatingTagOutputMsg = tagCreated
      this.tagName = tagName

      return this
    } catch (err) { return logError('Creating Tag failed:', err) }
  }

}

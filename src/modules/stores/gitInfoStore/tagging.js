// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const TAGGING = {

  async createTag({
    tagNameBase,
    version,
    description
  }) {
    if (!description || !version || !tagNameBase) return logError(
      'Creating Tag failed:',
      'No description or version or tag name base'
    )

    try {
      const tagName = `${tagNameBase}-${cleanUpFromN(version)}`

      const {
        code,
        ErrorMessage
      } = await new GitService()
        .createGitTag({
          description: cleanUpFromN(description),
          tagName
        })

      if (code !== 0) throw new Error(ErrorMessage)

      this.tagName = tagName

      return this
    } catch (err) { return logError('Creating Tag failed:', err) }
  }

}

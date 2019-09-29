// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

export const PUSHING = {

  async pushCommit(branchNameBase) {
    console.log('branchNameBase', branchNameBase)
    try {
      const pushStatus = await new GitService()
        .handlePushCommit(branchNameBase)

      if (!pushStatus) throw new Error('Commiting to GIT failed')

      this.pushingCommitOutputMsg = pushStatus

      return this
    } catch (err) { return logError('Creating Commit Message failed:', err) }
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

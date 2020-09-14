// Services
import { DavaiCommit } from 'davai-commit'

// Handlers
import { logError, logThis } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const PUSHING = {
  async pushCommit({ branchName }) {
    logThis('Wait...', `PUSHING COMMIT ON BRANCH [ ${branchName} ]`)

    try {
      const {
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService()
        .pushCommit({ branchName: cleanUpFromN(branchName) })

      if (code !== 0) throw new Error(ErrorMessage)

      return this
    } catch (err) { return logError('Pushing commit failed:', err) }
  },

  async pushAfterMerge({ branchName }) {
    if (!branchName) return logError(
      'Pushing After merge failed:',
      'No branch name was provided'
    )

    try {
      const {
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().pushAfterMerge({ branchName })

      if (code !== 0) throw new Error(ErrorMessage)

      return this
    } catch (err) { return logError('Pushing after merge failed:', err) }
  },

  async pushReleaseTag() {
    const { tagName = null } = this
    if (!tagName) return logError('Pushing Tag failed:', 'No tag name was provided')

    try {
      const {
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().pushReleaseTag({ tagName })

      if (code !== 0) throw new Error(ErrorMessage)

      this.releaseTagPushed = code === 0
      return this
    } catch (err) { return logError('Pushing release tag failed:', err) }
  }

}

// Services
import { DavaiCommit } from 'davai-commit'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const MERGING = {

  async mergeBranch(branchName) {
    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().mergeBranch(branchName)

      if (code !== 0) throw new Error(ErrorMessage)

      this.mergeStatus = cleanUpFromN(result)

      return this
    } catch (err) { return logError(`Merging branch [ ${branchName} ] failed:`, err) }
  }

}

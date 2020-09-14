// Services
import { DavaiCommit } from 'davai-commit'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN } from '../../../helpers/help'

export const PULLING = {

  async pullBranch(branchName) {
    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().pullBranch(branchName)

      if (code !== 0) throw new Error(ErrorMessage)

      this.mergeStatus = cleanUpFromN(result)

      return this
    } catch (err) { return logError(`Pulling branch [ ${branchName} ] failed:`, err) }
  }

}

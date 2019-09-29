// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

export const OTHER = {

  async checkOpenReleases(openPrBaseToCheck) {
    if (!openPrBaseToCheck) return logError('Checking open releases failed:', 'No name to check provided')

    try {
      await new GitService().fetchHistory()
      const {
        result,
        code,
        ErrorMessage
      } = await new GitService().getOpenPRs()

      if (code !== 0) throw new Error(ErrorMessage)

      this.allOpenPrs = result

      const regex = RegExp(openPrBaseToCheck, 'g')

      return !regex.test(result)
    } catch (err) { return logError('Checking open releases failed:', err) }
  }

}

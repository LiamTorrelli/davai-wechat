// Services
import { GitService } from '../../../services/gitService'

// Handlers
import { logError } from '../../../handlers/outputHandler'

// Helpers
import { cleanUpFromN, getMaxLength } from '../../../helpers/help'

export const COMMITTING = {

  async createCommit() {
    const { commitMessage } = this
    try {
      const filesStaged = await new GitService()
        .handleAddFilesToGitStage()

      if (!filesStaged) throw new Error('Staging files failed')

      const commitStatus = await new GitService()
        .handleCommit(commitMessage)

      if (!commitStatus) throw new Error('Commiting to GIT failed')

      this.commitStatus = commitStatus

      return this
    } catch (err) { return logError('Creating Commit Message failed:', err) }
  },

  async createCommitMessage({
    releaseActionDate = null,
    description = null,
    newVersion = null
  }) {
    if (!releaseActionDate) return logError('Creating Commit Message failed:', 'No date')

    const { commitType } = this

    if (commitType === 'release' && description && newVersion) {
      const { releaseType } = this

      const message = await this.createReleaseCommitMessage({
        releaseType,
        description,
        newVersion,
        releaseActionDate
      })

      if (!message) return logError('Creating Commit Message failed:', 'No message was constructed')

      this.commitMessage = message

      return this
    }

    if (commitType === 'release' && description) {
      // TODO: Make a normal commit
      console.log('Normal commit function is not ready yet')
    }

    return logError('Creating Commit Message failed', 'TODO: Make a normal commit')
  },

  async createReleaseCommitMessage({
    releaseType = null,
    newVersion = null,
    releaseActionDate,
    description
  }) {
    const {
      day,
      month,
      weekDay,
      year
    } = releaseActionDate

    const { developer } = this

    const dateString = `${month} ${day} ${year} (${weekDay})`
    let message = ''
    const developerLine = `  ✸ Developer: ${cleanUpFromN(developer)}`
    const dateLine = `  ✸ Date: ${cleanUpFromN(dateString)}`

    const dividerLength = getMaxLength(developerLine.length, dateLine.length)

    let divider = '☐'

    for (let i = 0; i < dividerLength; i += 1) divider += '-'
    divider += '☐'

    message += `❍ RELEASE-${cleanUpFromN(newVersion)} ❍ [ ${releaseType} ]\n\n`
    message += `  Description: ${cleanUpFromN(description)}\n\n`
    message += `${divider}\n`
    message += `${developerLine}\n`
    message += `${dateLine}\n`
    message += `${divider}`

    return message
  }

}

// Services
import { DavaiCommit } from 'davai-commit'

// Handlers
import { logError, logThis } from '../../../handlers/outputHandler'

// Helpers
import {
  cleanUpFromN,
  cleanUpSpaces,
  getMaxLength
} from '../../../helpers/help'

// Words
import { statusLetters } from '../../../config/otherWords/gitStatusNames'

export const COMMITTING = {
  async commitChanges(msg) {
    logThis(msg, 'COMMITING')

    try {
      const {
        result,
        code,
        ErrorMessage
      } = await new DavaiCommit.GitService().commitChanges({ commitMessage: msg })

      if (code !== 0
        && !result.includes('nothing to commit, working tree clean')
      ) throw new Error(ErrorMessage)

      this.commitStatus = result
      return this
    } catch (err) { return logError('Committing changes failed:', err) }
  },

  async createAutoCommitMsg({
    actionTime = null
  }) {
    if (!actionTime) return logError('Creating Commit Message failed:', 'No date')

    const { statusedFiles } = this

    let maxLengthFullLine = 0
    let maxLengthStatus = 0
    const allStatuses = []

    const filesWithStatus = statusedFiles.split('\n').map(fileName => {
      const statusName = cleanUpFromN(
        cleanUpSpaces(
          `${fileName.charAt(0)}${fileName.charAt(1)}`
        )
      )
      const fileNameNoStatus = cleanUpSpaces(fileName.split(statusName).join(''))
      const { shortName } = statusLetters[statusName] || {}
      if (shortName) {
        const fileLine = `  ${shortName}:  ${fileNameNoStatus}`

        if (fileLine.length > maxLengthFullLine) maxLengthFullLine = fileLine.length
        if (shortName.length > maxLengthStatus) maxLengthStatus = shortName.length

        allStatuses.push(shortName)

        return {
          status: shortName,
          fileName: fileNameNoStatus
        }
      }
    }).filter(v => v)

    const { day, month, time } = actionTime
    const { developer } = this

    const dateString = `${month} ${day} [ ${time} ]`

    let message = ''
    let divider = '☐'

    for (let i = 0; i < maxLengthFullLine + 1; i += 1) divider += '-'

    divider += '☐'

    message += `❍ Automatic commit by: ${cleanUpFromN(developer)}\n`
    message += `${divider}\n`

    for (let i = 0; i < filesWithStatus.length; i += 1) {
      message += `${filesWithStatus[i].status}`.padStart(maxLengthStatus + 2)
      message += `:  ${filesWithStatus[i].fileName}\n`
    }

    message += `${divider}\n`
    message += `Generated: ${dateString}`

    this.commitMessage = message

    return message
  },

  async createReleaseMsg({
    actionTime = null,
    releaseType = null,
    newVersion = null,
    description = null
  }) {
    if (!actionTime || !releaseType || !newVersion || !description) return logError(
      'Creating release message failed:',
      'No date or release type or new version or description'
    )

    const {
      day,
      month,
      weekDay,
      year
    } = actionTime

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
  },

  async createCommitMsg({
    actionTime = null,
    branchName = null
  }) {
    if (!actionTime || !branchName) return logError(
      'Creating commit message failed:',
      'No date or branch name provided'
    )

    const { day, month, time } = actionTime
    const { developer } = this

    const dateString = `${month} ${day} [ ${time} ]`

    let message = ''
    const developerLine = `  ✸ Developer: ${cleanUpFromN(developer)}`
    const dateLine = `  ✸ Date: ${cleanUpFromN(dateString)}`

    const dividerLength = getMaxLength(developerLine.length, dateLine.length)

    let divider = '☐'

    for (let i = 0; i < dividerLength; i += 1) divider += '-'
    divider += '☐'

    message += `❍ STARTED ${cleanUpFromN(branchName)} ❍\n\n`
    message += `${divider}\n`
    message += `${developerLine}\n`
    message += `${dateLine}\n`
    message += `${divider}`

    return message
  }
}

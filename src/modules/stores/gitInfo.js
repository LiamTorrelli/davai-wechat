// Libs
import { observable, action, autorun } from 'mobx'

// Services
import { GitService } from '../../services/gitService'

// Handlers
import { logError, logAutorun, logStoreValues } from '../../handlers/outputHandler'

// Helpers
import { cleanUpFromN, getMaxLength } from '../../helpers/help'

export const GitInfoStore = observable({
  developer: null,
  currentBranch: null,
  statusedFiles: [],
  switchedToReleaseBranch: false,
  commitMessage: '',
  pushingCommitOutputMsg: '',
  creatingTagOutputMsg: '',
  tagName: '',
  tagPushStatus: '',

  async setCurrentBranch() {
    try {
      const branchName = await new GitService().getCurrentBranch()

      this.currentBranch = branchName
      return this
    } catch (err) { return logError('Setting current branch failed:', err) }
  },

  async switchToAReleaseBranch(version) {
    try {
      const outputFromShell = await new GitService()
        .createReleaseBranch(version)

      this.switchedToReleaseBranch = outputFromShell.length
        ? outputFromShell.includes('Switched to a new branch')
        : ''

      return this.switchedToReleaseBranch
    } catch (err) { return logError('Switching To A Release Branch failed:', err) }
  },

  async setStatusedFiles() {
    try {
      const statusedFiles = await new GitService()
        .getGitStatus() || null
      this.statusedFiles = statusedFiles

      return this
    } catch (err) { return logError('Setting status files failed:', err) }
  },

  async setDeveloper() {
    try {
      const userName = await new GitService()
        .getGitUserName() || null
      this.developer = userName

      return this
    } catch (err) { return logError('Setting developer failed:', err) }
  },

  async createReleaseCommitMessage(
    releaseType,
    description,
    newVersion,
    dateObj
  ) {
    const {
      day,
      month,
      weekDay,
      year
    } = dateObj
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

  async createCommitMessage(
    releaseType,
    description,
    newVersion,
    dateObj
  ) {
    if (!dateObj) return logError('Creating Commit Message failed:', 'No date')

    if (releaseType && description && newVersion) {
      const message = await this.createReleaseCommitMessage(
        releaseType,
        description,
        newVersion,
        dateObj
      )

      if (!message) return logError('Creating Commit Message failed:', 'No message was constructed')

      this.commitMessage = message

      return this
    }

    // TODO: Make a normal commit
    return logError('Creating Commit Message failed', 'TODO: Make a normal commit')
  },

  async pushCommit() {
    const { commitMessage } = this
    try {
      const filesStaged = await new GitService()
        .handleAddFilesToGitStage()

      if (!filesStaged) throw new Error('Staging files failed')

      const commitStatus = await new GitService()
        .handleCommit(commitMessage)

      if (!commitStatus) throw new Error('Commiting to GIT failed')

      const pushStatus = await new GitService()
        .handlePushCommit()

      if (!pushStatus) throw new Error('Commiting to GIT failed')

      this.pushingCommitOutputMsg = pushStatus

      return this
    } catch (err) { return logError('Creating Commit Message failed:', err) }
  },

  async pushTag() {
    const { tagName = null } = this
    if (!tagName) return logError('Pushing Tag failed:', 'No tagname was provided')

    try {
      const pushStatus = await new GitService()
        .handlePushTag(tagName)

      this.tagPushStatus = pushStatus

      return this
    } catch (err) { return logError('Pushing Tag failed:', err) }
  },

  async createTag(description, version) {
    if (!description || !version) return logError('Creating Tag failed:', 'No description or version')

    try {
      const tagName = `TESTBUILD-${cleanUpFromN(version)}`

      const tagCreated = await new GitService()
        .handleCreateGitTag(cleanUpFromN(description), tagName)

      this.creatingTagOutputMsg = tagCreated
      this.tagName = tagName

      return this
    } catch (err) { return logError('Creating Tag failed:', err) }
  }

}, {
  setDeveloper: action,
  setCurrentBranch: action,
  setStatusedFiles: action,
  switchToAReleaseBranch: action,
  createCommitMessage: action,
  pushCommit: action,
  createTag: action
})

autorun(() => {
  logAutorun('Git Info')
  // logStoreValues(GitInfoStore, 'GitInfoStore')
})

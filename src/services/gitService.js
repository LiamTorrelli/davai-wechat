// Controllers
import { ShellExecutor } from '../controllers/shellExecutor'
import { __isEmpty, cleanUpFromN } from '../helpers/help'

export class GitService {
/**
 * Getting current git branch @return {String || false}
 */
  async getCurrentBranch() {
    try {
      const { symbolicrefShortHEAD } = await new ShellExecutor('git')
        .setNeededParams('symbolic-ref --short HEAD')
        .neededInfo

      return cleanUpFromN(symbolicrefShortHEAD)
    } catch (err) {
      console.warn('Getting current branch failed:', err)
      return false
    }
  }

  /**
   * Getting current git branch @return {String || false}
   */
  async createReleaseBranch(version) {
    try {
      const outputFromShell = new ShellExecutor('git', version)
        .setNeededParams('checkout -b')
        .performAction

      return outputFromShell
    } catch (err) {
      console.warn('Creating a release branch failed:', err)
      return false
    }
  }

  async handleCreateGitTag(description, tagName) {
    const status = await new ShellExecutor()
      .executeCode(`git tag -a "${tagName}" -m "TEST: ${description}"`)

    return status
  }

  async handleAddFilesToGitStage(allFiles = true) {
    // TODO: abilty to choose files to add to commit
    try {
      const action = allFiles ? 'git add .' : 'git add .'

      const status = await new ShellExecutor()
        .executeCode(`${action}`)

      return status
    } catch (err) {
      console.warn('Handling Adding Files To Git Stage failed:', err)
      return false
    }
  }

  async handleCommit(commitMessage) {
    try {
      const status = await new ShellExecutor()
        .executeCode(`git commit -m "${commitMessage}"`)

      return status
    } catch (err) {
      console.warn('Handling Commit failed:', err)
      return false
    }
  }

  async handlePushCommit() {
    try {
      const status = await new ShellExecutor()
        .executeCode('git push')

      return status
    } catch (err) {
      console.warn('Handling Pushing Commit failed:', err)
      return false
    }
  }

  async handlePushTag(tagName) {
    try {
      const status = await new ShellExecutor()
        .executeCode(`git push origin "${tagName}"`)

      return status
    } catch (err) {
      console.warn('Handling Pushing Tag failed:', err)
      return false
    }
  }

  /**
  * Getting git status @return {String || false}
  */
  getGitStatus() {
    try {
      const { statussU: status } = new ShellExecutor('git')
        .setNeededParams('status -s -u')
        .neededInfo

      return status
    } catch (err) {
      console.warn('Getting git status failed:', err)
      return false
    }
  }

  /**
  * Getting git user name @return {String || false}
  */
  getGitUserName() {
    try {
      const { configusername: userName } = new ShellExecutor('git')
        .setNeededParams('config user.name')
        .neededInfo

      return userName
    } catch (err) {
      console.warn('Getting git user name failed:', err)
      return false
    }
  }
}

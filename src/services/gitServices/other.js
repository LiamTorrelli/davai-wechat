// Libs
import shell from 'shelljs'

export const OTHER = {
  /**
  * Getting git status @return {String || false}
  */
  getGitStatus() {
    const output = shell.exec('git status -s -u')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  /**
  * Getting git user name @return {String || false}
  */
  getGitUserName() {
    const output = shell.exec('git config user.name')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  /**
   * Fetch repo history @return {String || false}
   */
  fetchHistory() {
    const output = shell.exec('git fetch --all')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }
}

// Libs
import shell from 'shelljs'

export const BRANCHING = {

  /**
   * Getting current git branch @return {String || false}
   */
  async getCurrentBranch() {
    const output = shell.exec('git symbolic-ref --short HEAD')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  /**
   * Creating a branch @return {String || false}
   */
  async createBranch(branch) {
    const output = shell.exec(`git checkout -b ${branch}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  /**
   * Getting open pull requests @return {String || false}
   */
  async getOpenPRs() {
    const output = shell.exec('git ls-remote --heads origin')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  /**
   * Getting tags @return {String || false}
   */
  async getAllTags() {
    const output = shell.exec('git ls-remote --tags origin')
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }

}

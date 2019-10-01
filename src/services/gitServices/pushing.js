// Libs
import shell from 'shelljs'

export const PUSHING = {

  async pushCommit(branchName) {
    if (!branchName) throw new Error('Handling Pushing Commit failed, no branch name found')

    const output = shell.exec(`git push origin ${branchName}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

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

}

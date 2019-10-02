// Libs
import shell from 'shelljs'

export const PUSHING = {

  async pushCommit({ branchName }) {
    if (!branchName) throw new Error('Handling Pushing Commit failed, no branch name found')

    const output = shell.exec(`git push --set-upstream origin ${branchName}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  async pushAfterMerge({ branchName }) {
    if (!branchName) throw new Error('Handling Pushing Commit failed, no branch name found')

    const output = shell.exec(`git push --set-upstream origin ${branchName}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  },

  async pushReleaseTag({ tagName }) {
    if (!tagName) throw new Error('Handling Pushing tag failed, no tag name found')

    const output = shell.exec(`git push origin ${tagName}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }

}

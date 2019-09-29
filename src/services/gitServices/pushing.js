export const PUSHING = {

  async handlePushTag(tagName) {
    try {
      const status = await new ShellExecutor()
        .executeCode(`git push origin "${tagName}"`)

      return status
    } catch (err) {
      console.warn('Handling Pushing Tag failed:', err)
      return false
    }
  },

  async handlePushCommit(branchName) {
    if (!branchName) throw new Error('Handling Pushing Commit failed, no branch name found')

    try {
      const status = await new ShellExecutor()
        .executeCode(`git push origin ${branchName}`)

      return status
    } catch (err) {
      console.warn('Handling Pushing Commit failed:', err)
      return false
    }
  }

}

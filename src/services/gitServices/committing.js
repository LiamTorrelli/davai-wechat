export const COMMITTING = {
  async handleCommit(commitMessage) {
    try {
      const { code, stdout } = shell.exec(`git commit -m "${commitMessage}"`, { async: false })

      if (code === 0) return true

      return stdout.includes('nothing to commit, working tree clean')
    } catch (err) {
      console.warn('Handling Commit failed:', err)
      return false
    }
  }
}

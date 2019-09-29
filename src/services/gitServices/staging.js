export const STAGING = {
  async handleAddFilesToGitStage(allFiles = true) {
    // TODO: abilty to choose files to add to commit
    try {
      const action = allFiles ? 'add .' : 'add .'

      const { code } = shell.exec(`git ${action}`, { async: false })

      return code === 0
    } catch (err) {
      console.warn('Handling Adding Files To Git Stage failed:', err)
      return false
    }
  }
}

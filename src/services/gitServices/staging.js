// Libs
import shell from 'shelljs'

export const STAGING = {
  async addFilesToGitStage(allFiles = true) {
    // TODO: abilty to choose files to add to commit
    const action = allFiles ? 'add .' : 'add .'

    const output = shell.exec(`git ${action}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }
}

// Libs
import shell from 'shelljs'

export const PULLING = {

  async pullBranch(branchName) {
    const output = shell.exec(`git pull origin ${branchName}`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }

}

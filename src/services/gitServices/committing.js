// Libs
import shell from 'shelljs'

export const COMMITTING = {
  async commitChanges({ msg }) {
    const output = shell.exec(`git commit -m "${msg}"`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }
}

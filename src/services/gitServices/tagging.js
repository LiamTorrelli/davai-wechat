import shell from 'shelljs'

export const TAGGING = {

  async createGitTag({ description, tagName }) {
    const output = shell.exec(`git tag -a "${tagName}" -m "${description}"`)
    const { stdout, stderr, code } = output

    return {
      ErrorMessage: stderr || null,
      result: stdout,
      code
    }
  }

}

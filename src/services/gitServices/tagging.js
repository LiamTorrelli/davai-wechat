export const TAGGING = {

  async handleCreateGitTag(description, tagName) {
    const status = await new ShellExecutor()
      .executeCode(`git tag -a "${tagName}" -m "TEST: ${description}"`)

    return status
  }

}

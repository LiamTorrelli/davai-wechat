const tasks = {
  defaultTask: {
    title: '# defaultTask. Default task, pls provide description',
    error: '# defaultTask. Default errored task handler, pls provide description'
  },

  checkIfFilesExist: {
    title: '# Checking file(s). Making sure startup file(s) exist(s)',
    error: '# At least one of the start up files does not exist. Check DAVAI-CONFIG.json'
  },
  checkStartUpBranch: {
    title: '# Checking the branch name.',
    error: '# You should be on the [ integration ] branch'
  },
  checkOpenReleases: {
    title: '# Checking other open releases',
    error: '# You should not have other open releases not merged into master'
  },
  setGitInfo: {
    title: '# Setting GIT info',
    error: '# There was an error while getting git info'
  },
  setProjectInfo: {
    title: '# Setting the VERSION and other project info',
    error: '# There was an error while getting VERSION or project info'
  },
  createProductionFiles: {
    title: '# Preparing production files',
    error: '# There was an error while preparing production files'
  },
  updateProductionFiles: {
    title: '# Updating production files with new version',
    error: '# There was an error while Updating production files with new version'
  },
  gitCreateBranch: {
    title: '# Creating a release branch',
    error: '# There was an error while creating a release branch'
  },
  generateWechatPreview: {
    title: '# Generate preview in WeChat Devtools',
    error: '# There was an error while Generating preview in WeChat Devtools'
  },
  loginWechatDevtools: {
    title: '# Log in WeChat Devtools',
    error: '# There was an error while Logging in WeChat Devtools'
  },
  submitWechatRelease: {
    title: '# Publishing RELEASE into WeChat',
    error: '# There was an error while publishing code to wechat server'
  },
  deleteProductionFiles: {
    title: '# Deleting production files',
    error: '# There was an error while deleting production files'
  },
  createGithubCommit: {
    title: '# Submiting changes to GitHub',
    error: '# There was an error while Submiting changes to GitHub'
  },
  createBuildTag: {
    title: '# Creating TAG',
    error: '# There was an error while Creating TAG'
  }
}

export { tasks }

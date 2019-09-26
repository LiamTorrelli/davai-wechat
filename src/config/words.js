const tasks = {
  0: {
    title: '# 0. Default task, pls provide description',
    error: '# 0. Default errored task handler, pls provide description'
  },
  1: {
    title: '# 1. Checking file(s). Making sure startup file(s) exist(s)',
    error: '# 1. At least one of the start up files does not exist. Check ICWT_CONFIG.json'
  },
  2: {
    title: '# 2. Checking the branch name.',
    error: '# 2. You should be on the [ integration ] branch'
  },
  3: {
    title: '# 3. Setting GIT info',
    error: '# 3. There was an error while getting git info'
  },
  4: {
    title: '# 4. Setting the VERSION and other project info',
    error: '# 4. There was an error while getting VERSION or project info'
  },
  5: {
    title: '# 5. Creating a release branch',
    error: '# 5. There was an error while creating a release branch'
  },
  6: {
    title: '# 6. Preparing production files',
    error: '# 6. There was an error while preparing production files'
  },
  7: {
    title: '# 7. Updating production files with new version',
    error: '# 7. There was an error while Updating production files with new version'
  },
  8: {
    title: '# 8. Login WeChat Devtools',
    error: '# 8. There was an error while logining in WeChat Devtools'
  },
  9: {
    title: '# 9. Publishing RELEASE into WeChat',
    error: '# 9. There was an error while publishing code to wechat server'
  },
  10: {
    title: '# 10. Deleting production files',
    error: '# 10. There was an error while deleting production files'
  },
  11: {
    title: '# 11. Submiting changes to GitHub',
    error: '# 11. There was an error while Submiting changes to GitHub'
  },
  12: {
    title: '# 12. Creating TAG',
    error: '# 12. There was an error while Creating TAG'
  }
}

export { tasks }

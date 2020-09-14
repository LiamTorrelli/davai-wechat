import inquirer from 'inquirer'

// Stores
import { ShellArgumentsStore, FilesInfoStore } from '../modules/index'

// Handlers
import {
  logError
} from '../handlers/outputHandler'

async function promptForMissingOptions() {
  const questions = []
  let answers
  const {
    actionType,
    taskName,
    pagePath,
    pageQueryParams,
    releaseType,
    description,
    newReleaseBranch
  } = ShellArgumentsStore

  if (actionType === 'preview') {
    const { DEFAULT_PAGE_PATH } = await FilesInfoStore.setDefaultPagePath()
    if (!DEFAULT_PAGE_PATH) throw new Error('Please provide the default page path for preview [ DEFAULT_PAGE_PATH ]')

    questions.push({
      type: 'input',
      name: 'taskName',
      message: 'Please provide the task name or description',
      default: 'WHZN-777 | Fixed the bug'
    })

    questions.push({
      type: 'input',
      name: 'pagePath',
      message: 'Please provide the page path',
      default: DEFAULT_PAGE_PATH
    })

    questions.push({
      type: 'input',
      name: 'pageQueryParams',
      message: 'Please provide the query params [ city=Angarsk&is=awesome ]',
      default: ''
    })

    answers = await inquirer.prompt(questions)

    ShellArgumentsStore.setTaskName(taskName || answers.taskName)
    ShellArgumentsStore.setPagePath(pagePath || answers.pagePath)
    ShellArgumentsStore.setPageQueryParams(pageQueryParams || answers.pageQueryParams)

    ShellArgumentsStore.setActionType(actionType || answers.actionType)
  } else if (actionType === 'release') {
    if (!releaseType) {
      questions.push({
        type: 'list',
        name: 'releaseType',
        message: 'Please choose the type of the release',
        choices: ['fix', 'feature']
      })
    }

    if (!description) {
      questions.push({
        type: 'input',
        name: 'releaseDescription',
        message: 'Please provide the release description',
        default: 'New RELEASE!'
      })
    }

    answers = await inquirer.prompt(questions)

    ShellArgumentsStore.setReleaseType(releaseType || answers.releaseType)
    ShellArgumentsStore.setDescription(description || answers.releaseDescription)

    ShellArgumentsStore.setActionType(actionType || answers.actionType)
  } else if (actionType === 'create') {
    const { GIT_INTEGRATION_RELEASE_BRANCH_BASE: branchBase } = await FilesInfoStore.setIntegrationReleaseBranchBase()

    if (!branchBase)
      throw new Error('Please provide integration release branch base [ GIT_INTEGRATION_RELEASE_BRANCH_BASE ]')

    if (!newReleaseBranch) {
      questions.push({
        type: 'input',
        name: 'newReleaseBranch',
        message: 'Please provide the new release version (0.0.1)',
        default: '0.0.0'
      })
    }
    answers = await inquirer.prompt(questions)

    const newReleaseBranchNameFull = `${branchBase}-${answers.newReleaseBranch}`
    // TODO: check if the version is correct
    ShellArgumentsStore.setNewReleaseBranch(newReleaseBranch || newReleaseBranchNameFull)
  } else {
    logError('DAVAI-WECHAT only supports preview|release|create')
    process.exit(0)
  }

  return true
}

export { promptForMissingOptions }

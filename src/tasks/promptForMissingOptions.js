import inquirer from 'inquirer'

// Stores
import { ShellArgumentsStore, FilesInfoStore } from '../modules/index'

async function promptForMissingOptions() {
  const questions = []
  let answers
  const {
    actionType,
    taskName,
    pagePath,
    pageQueryParams,
    releaseType,
    description
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
    // TODO - put this param in the config
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
  } else {
    console.log('davai-wechat only supports preview|release')
    process.exit(0)
  }

  return true
}

export { promptForMissingOptions }

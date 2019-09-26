import inquirer from 'inquirer'

// Stores
import { ShellArgumentsStore } from '../modules/index'

async function promptForMissingOptions() {
  const questions = []
  const { releaseType, description } = ShellArgumentsStore

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

  const answers = await inquirer.prompt(questions)

  ShellArgumentsStore.setReleaseType(releaseType || answers.releaseType)
  ShellArgumentsStore.setDescription(description || answers.releaseDescription)

  return true
}

export { promptForMissingOptions }

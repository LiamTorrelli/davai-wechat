// Libs
import Listr from 'listr'
import shell from 'shelljs'

// Words
import { tasks } from '../config/words'

// Handlers
import { logSuccess, logInfo, logError } from '../handlers/outputHandler'
import { taskHandler } from '../handlers/taskHandler'

async function createBuildForProject() {
  try {
    const output = shell.exec(
      'yarn --silent && yarn build --silent',
      { async: false }
    )

    const { stderr, code } = output

    const ErrorMessage = stderr || null

    if (code !== 0) throw new Error(ErrorMessage)

    return true
  } catch (err) { console.warn('failed:', err); return false }
}

export async function buildProject() {
  logInfo('Building project')

  const tasksToRun = new Listr([
    { /*  ** createBuildForProject **  */
      task: () => taskHandler('createBuildForProject', createBuildForProject),
      title: tasks['createBuildForProject'].title
    }
  ])

  await tasksToRun.run()
    .catch(err => {
      console.log('\n\n')
      logError('Building tasks failed:', err)
      process.exit(1)
    })

  logSuccess('Project was built successfully, let\'s continue')
}

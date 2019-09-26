// Handlers
import { logError, _Errors } from './outputHandler'
import { tasks } from '../config/words'

const taskHandler = async (
  wordsNumber = 0,
  taskFunction,
  params = null
) =>
  taskFunction(params)
    .then(isTaskOkk => (isTaskOkk
      ? Promise.resolve(isTaskOkk)
      : Promise.reject((tasks[wordsNumber].error))
    )).catch(err => { throw new Error(err) })

export { taskHandler }

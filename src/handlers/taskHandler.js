// Handlers
import { _Errors } from './outputHandler'
import { tasks } from '../config/words'

const taskHandler = async (
  taskName,
  taskFunction,
  params = null
) =>
  taskFunction(params)
    .then(isTaskOkk => (isTaskOkk
      ? Promise.resolve(isTaskOkk)
      : Promise.reject((tasks[taskName].error))
    )).catch(err => {
      console.log('!!!! taskHandler')
      throw new Error(err)
    })

export { taskHandler }

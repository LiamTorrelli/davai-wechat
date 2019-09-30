import { observable, action, autorun } from 'mobx'

// Handlers
import { logAutorun, logStoreValues } from '../../handlers/outputHandler'

export const ShellArgumentsStore = observable({
  directory: null,
  actionType: null,
  taskName: null,
  pagePath: null,
  pageQueryParams: null,
  releaseType: null,
  description: null,

  setDirectory(dir) {
    this.directory = dir

    return this
  },
  setActionType(actionType) {
    this.actionType = actionType

    return this
  },
  setTaskName(taskName) {
    this.taskName = taskName

    return this
  },
  setPagePath(pagePath) {
    this.pagePath = pagePath

    return this
  },
  setPageQueryParams(pageQueryParams) {
    this.pageQueryParams = pageQueryParams

    return this
  },
  setReleaseType(releaseType) {
    this.releaseType = releaseType

    return this
  },
  setDescription(description) {
    this.description = description

    return this
  }

}, {
  setDirectory: action,
  setReleaseType: action,
  setDescription: action,
  setActionType: action,
  setTaskName: action,
  setPagePath: action,
  setPageQueryParams: action
})

autorun(() => {
  logAutorun('Shell Arguments')
  // logStoreValues(ShellArgumentsStore, 'ShellArgumentsStore')
})

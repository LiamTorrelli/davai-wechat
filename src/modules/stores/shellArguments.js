import { observable, action } from 'mobx'

export const ShellArgumentsStore = observable({
  directory: null,
  actionType: null,
  taskName: null,
  pagePath: null,
  pageQueryParams: null,
  releaseType: null,
  description: null,
  newReleaseBranch: null,

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
  },
  setNewReleaseBranch(branch) {
    this.newReleaseBranch = branch

    return this
  }

}, {
  setDirectory: action,
  setReleaseType: action,
  setDescription: action,
  setActionType: action,
  setTaskName: action,
  setPagePath: action,
  setPageQueryParams: action,
  setNewReleaseBranch: action
})

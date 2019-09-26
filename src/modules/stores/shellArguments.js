import { observable, action, autorun } from 'mobx'

// Handlers
import { logAutorun, logStoreValues } from '../../handlers/outputHandler'

export const ShellArgumentsStore = observable({
  directory: null,
  releaseType: null,
  description: null,

  setDirectory(dir) {
    this.directory = dir

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
  setDescription: action
})

autorun(() => {
  logAutorun('Shell Arguments')
  // logStoreValues(ShellArgumentsStore, 'ShellArgumentsStore')
})

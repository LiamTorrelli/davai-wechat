import { observable, action } from 'mobx'
import { mapObjIndexed } from 'ramda'

// Helpers
import { cleanUpFromN, upTheVersion } from '../../helpers/help'
import { HumanDate } from '../../helpers/humanTimestamp'

// Service
import { FilesService } from '../../services/filesService'

// Handlers
import { logError } from '../../handlers/outputHandler'

export const ProjectInfoStore = observable({
  releaseType: null,
  actionTime: null,
  releaseDescription: null,
  oldVersion: null,
  newVersion: null,

  setProjectInfo(obj) {
    mapObjIndexed((value, key) => {
      this[key] = value
    }, obj)
    return this
  },
  setReleaseType(type) {
    this.releaseType = type
    return this
  },
  setReleaseActionDate() {
    try {
      const actionTime = new HumanDate(new Date(), 'en', false)
        .setNeededParam('humanDateObj')
        .neededInfo

      this.actionTime = actionTime
      return this
    } catch (err) { return logError('Setting Release Action Date failed:', err) }
  },
  setReleaseDescription(desc) {
    this.releaseDescription = desc
    return this
  },
  setOldVersion(versionFile) {
    try {
      const version = new FilesService()
        .setFilePath(versionFile)
        .contents

      this.oldVersion = cleanUpFromN(version)
      return this
    } catch (err) { return logError('Setting Old Version failed:', err) }
  },
  setNewVersion() {
    try {
      const newVersion = this.oldVersion;

      if (!newVersion) return logError('Setting New Version failed:', 'Problem with release type or old version')

      this.newVersion = newVersion

      return this
    } catch (err) { return logError('Setting New Version failed:', err) }
  }

}, {
  setProjectInfo: action,
  setReleaseType: action,
  setReleaseActionDate: action,
  setReleaseDescription: action,
  setOldVersion: action,
  setNewVersion: action
})

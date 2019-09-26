import { observable, action, autorun } from 'mobx'
import { mapObjIndexed } from 'ramda'

// Helpers
import { cleanUpFromN, upTheVersion } from '../../helpers/help'
import { HumanDate } from '../../helpers/humanTimestamp'

// Service
import { FilesService } from '../../services/filesService'

// Handlers
import { logError, logAutorun, logStoreValues } from '../../handlers/outputHandler'

export const ProjectInfoStore = observable({
  releaseType: null,
  releaseActionDate: null,
  releaseDescription: null,
  oldVersion: null,
  newVersion: '1.21.4',

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
      const releaseActionDate = new HumanDate(new Date(), 'en')
        .setNeededParam('humanDateObj')
        .neededInfo

      this.releaseActionDate = releaseActionDate
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
  setNewVersion(releaseType) {
    try {
      const newVersion = upTheVersion(this.oldVersion, releaseType)

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

autorun(() => {
  logAutorun('Project Info')
  // logStoreValues(ProjectInfoStore, 'ProjectInfoStore')
})

// Libs
import { observable, action, autorun } from 'mobx'

// Functions
import {
  SETTING,
  COMMITTING,
  BRANCHING,
  PUSHING,
  TAGGING,
  MERGING,
  OTHER,
  STAGING
} from './gitInfoStore/index'

// Handlers
import { logAutorun } from '../../handlers/outputHandler'

export const GitInfoStore = observable({
  developer: null,
  currentBranch: null, // setCurrentBranch
  allOpenPrs: null, // checkOpenReleases
  commitType: '',
  releaseType: '',
  statusedFiles: [],
  switchedToReleaseBranch: false,
  commitMessage: '',
  commitStatus: '',
  pushingCommitOutputMsg: '',
  creatingTagOutputMsg: '',
  tagName: '',
  tagPushStatus: '',

  ...SETTING,
  ...COMMITTING,
  ...STAGING,
  ...BRANCHING,
  ...PUSHING,
  ...TAGGING,
  ...MERGING,
  ...OTHER

}, {
  setDeveloper: action,
  setCurrentBranch: action,
  setStatusedFiles: action,
  switchToAReleaseBranch: action,
  createReleaseMsg: action,
  pushCommit: action,
  createTag: action,
  checkOpenReleases: action,
  mergeBranch: action,
  stageFiles: action
})

autorun(() => {
  logAutorun('Git Info')
  // logStoreValues(GitInfoStore, 'GitInfoStore')
})

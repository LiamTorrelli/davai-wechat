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
  STAGING,
  PULLING
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
  ...OTHER,
  ...PULLING

}, {
  setDeveloper: action,
  setCurrentBranch: action,
  setStatusedFiles: action,
  switchToAReleaseBranch: action,
  switchToNewReleaseBranch: action,
  createReleaseMsg: action,
  createCommitMsg: action,
  pushCommit: action,
  createTag: action,
  checkOpenReleases: action,
  mergeBranch: action,
  stageFiles: action,
  pullBranch: action
})

autorun(() => {
  logAutorun('Git Info')
  // logStoreValues(GitInfoStore, 'GitInfoStore')
})

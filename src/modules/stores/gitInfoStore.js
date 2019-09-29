// Libs
import { observable, action, autorun } from 'mobx'

// Functions
import {
  SETTING,
  COMMITTING,
  BRANCHING,
  PUSHING,
  TAGGING,
  OTHER
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
  ...BRANCHING,
  ...PUSHING,
  ...TAGGING,
  ...OTHER

}, {
  setDeveloper: action,
  setCurrentBranch: action,
  setStatusedFiles: action,
  switchToAReleaseBranch: action,
  createCommitMessage: action,
  pushCommit: action,
  createTag: action,
  checkOpenReleases: action
})

autorun(() => {
  logAutorun('Git Info')
  // logStoreValues(GitInfoStore, 'GitInfoStore')
})

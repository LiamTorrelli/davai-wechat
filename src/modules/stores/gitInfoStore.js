// Libs
import { observable, action } from 'mobx'

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

export const GitInfoStore = observable({
  developer: null,
  currentBranch: null, // setCurrentBranch
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
  mergeBranch: action,
  stageFiles: action,
  pullBranch: action
})

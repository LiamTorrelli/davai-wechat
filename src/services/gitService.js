// Functions
import {
  BRANCHING,
  MERGING,
  STAGING,
  COMMITTING,
  OTHER,
  PUSHING,
  SETTING,
  TAGGING,
  PULLING
} from './gitServices'

export class GitService {
  getCurrentBranch() { return BRANCHING.getCurrentBranch() }
  createBranch(args) { return BRANCHING.createBranch(args) }
  getOpenPRs() { return BRANCHING.getOpenPRs() }
  getGitStatus() { return OTHER.getGitStatus() }
  getGitUserName() { return OTHER.getGitUserName() }
  fetchHistory() { return OTHER.fetchHistory() }
  mergeBranch(args) { return MERGING.mergeBranch(args) }
  addFilesToGitStage(args) { return STAGING.addFilesToGitStage(args) }
  commitChanges(args) { return COMMITTING.commitChanges(args) }
  pushCommit(args) { return PUSHING.pushCommit(args) }
  pushReleaseTag(args) { return PUSHING.pushReleaseTag(args) }
  pushAfterMerge(args) { return PUSHING.pushAfterMerge(args) }
  createGitTag(args) { return TAGGING.createGitTag(args) }
  pullBranch(args) { return PULLING.pullBranch(args) }
}

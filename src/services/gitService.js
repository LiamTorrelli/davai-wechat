// Functions
import {
  BRANCHING,
  MERGING,
  COMMITTING,
  OTHER,
  PUSHING,
  SETTING,
  STAGING,
  TAGGING
} from './gitServices'

export class GitService {
  getCurrentBranch() { return BRANCHING.getCurrentBranch() }
  getGitStatus() { return OTHER.getGitStatus() }
  getGitUserName() { return OTHER.getGitUserName() }
  createBranch(args) { return BRANCHING.createBranch(args) }
  fetchHistory() { return OTHER.fetchHistory() }
  getOpenPRs() { return BRANCHING.getOpenPRs() }
  mergeBranch(args) { return MERGING.mergeBranch(args) }
}

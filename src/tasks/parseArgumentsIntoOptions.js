import arg from 'arg'

// Stores
import { ShellArgumentsStore } from '../modules/index'

/**
 * Parsing arguments that the user sends in the console
 * @param {array} rawArgs
 *
 * Setting in the ShellArgumentsStore:
 *  * action-type
 *  * release-type
 *  * description
 *  * directory
 *
 * @return {Boolean}
 */
function parseArgumentsIntoOptions(rawArgs) {
  // TODO: check for fix and feature spelled correctly
  /**
   * Raw arguments:
   * 1st: the nodeJS bin folder
   * 2nd: the icwt-management bin folder
   * Parsing params:
   *  --action-type preview|release
   *  --release-type fix|feature
   *  --description "This is a release description"
   */
  const args = arg({
    '--action-type': Boolean,
    '--release-type': Boolean,
    '--description': Boolean
  }, { argv: rawArgs.slice(2) })
  /**
   * If the user did not specify either of the params
   * he will be asked to do so in the cli-view
   */
  ShellArgumentsStore.setActionType(args._[0] || false)
  ShellArgumentsStore.setReleaseType(args._[1] || false)
  ShellArgumentsStore.setDescription(args._[2] || false)
  ShellArgumentsStore.setDirectory(process.cwd())

  return true
}

export { parseArgumentsIntoOptions }

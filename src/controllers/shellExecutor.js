import shell from 'shelljs'

export class ShellExecutor {
  constructor(initiatorName = '', branchName = '') {
    this.initiatorName = initiatorName
    this.neededParams = 'status'
    this.branchName = branchName
  }

  setNeededParams(neededParams) {
    this.neededParams = neededParams
    return this
  }

  createFiles(rootDirectory, filePathsArray) {
    const codes = []

    filePathsArray.forEach(file => {
      const { code } = shell.touch(`${rootDirectory}/${file}`)
      codes.push(code)
    })

    return codes.filter(code => code !== 0).length === 0
  }

  deleteFiles(rootDirectory, filePathsArray) {
    const codes = []

    filePathsArray.forEach(file => {
      const { code } = shell.rm('-rf', `${rootDirectory}/${file}`)
      codes.push(code)
    })

    return codes.filter(code => code !== 0).length === 0
  }

  executeCode(shellParams, isAsync = false) {
    const code = shell.exec(`${shellParams}`, { async: isAsync })
    console.log('code', code)
    return code.code === 0 || code.code === 1
  }

  paramToObjName(param) {
    if (!param) return 'default'

    let returnningObjName = ''

    const spacesDeleted = param.split(' ').join('')
    const dashesSanitized = spacesDeleted.split('--').join('-')
    const dottesSanitized = dashesSanitized.split('.').join('')
    const camelCased = dottesSanitized.split('-')

    if (camelCased.length > 1) {
      camelCased.forEach((word, index) => {
        if ((camelCased.length - 1) > index) returnningObjName += word
        else returnningObjName += word.charAt(0).toUpperCase() + word.slice(1)
      })
    } else returnningObjName += dottesSanitized
    return returnningObjName
  }

  get doAction() {
    const { initiatorName, branchName } = this
    try {
      const { stderr = '', code = 1 } = shell.exec(`${initiatorName} ${branchName}`)

      if (code !== 0) return new Error(`Failed to execute [ ${initiatorName} ${branchName} ]`)

      return stderr
    } catch (error) { return error }
  }

  get performAction() {
    const {
      neededParams,
      initiatorName,
      branchName
    } = this
    const releaseBranchRoot = 'testbuild'
    const fullBranchName = `${releaseBranchRoot}-${branchName}`
    try {
      const {
        stderr = '',
        code = 1
      } = shell.exec(`${initiatorName} ${neededParams} ${fullBranchName}`)

      if (code !== 0) return new Error(`Failed to execute [ ${initiatorName} ${neededParams} ${fullBranchName} ]`)

      return stderr
    } catch (error) { return error }
  }

  get neededInfo() {
    const {
      neededParams,
      initiatorName
    } = this
    const allParams = neededParams.split(',')
    let outputObj = {}
    allParams.forEach(param => {
      try {
        const output = shell.exec(`${initiatorName} ${param}`)
        const objName = this.paramToObjName(param)

        if (output.code !== 0 || output.stderr.includes('No names found, cannot describe anything.')) {
          outputObj = {
            ...outputObj,
            [objName]: output.stdout
          }
          throw new Error(`Failed to execute [ ${initiatorName} ${param} ]`)
        }

        outputObj = {
          ...outputObj,
          [objName]: output.stdout
        }
      } catch (error) {
        return error
      }
    })

    // shell.exec('clear')

    return outputObj
  }
}

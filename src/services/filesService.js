import fs from 'fs'
import path from 'path'
import { __isEmpty } from '../helpers/help'

export class FilesService {
  fileToJson() { return JSON.parse(fs.readFileSync(this.filePath, 'utf-8')) }

  fileContents() { return fs.readFileSync(this.filePath, 'utf-8') }

  checkIfFilesExist() {
    const { filePaths = [] } = this
    const filesStatuses = filePaths.map(fileName => fs.existsSync(path.join('.', fileName)))

    return filesStatuses.filter(v => !v).indexOf(false) !== 0
  }

  updateFilesWithVersion(
    filesToWrite,
    directory,
    oldVersion,
    newVersion
  ) {
    if (!filesToWrite
      || !directory
      || !oldVersion
      || !newVersion
    ) return new Error('Smth is not right with params while updating files with version')

    const foundTheLine = []

    const isEverythingOk = filesToWrite.map(file => {
      let newFile = { ...file }

      if (__isEmpty(file.lookingFor)) {
        // Updating the VERSION (type) file where there is just a plain version
        newFile = {
          ...file,
          lookingFor: oldVersion,
          replacement: newVersion,
          oneLineFile: true
        }
      } else {
        newFile = {
          ...file,
          lookingFor: `${file.lookingFor} '${oldVersion}'`.split('\n').join(''),
          replacement: `${file.lookingFor} '${newVersion}'`.split('\n').join(''),
          oneLineFile: false
        }
      }

      const linesOfAFile = fs.readFileSync(`${directory}/${newFile.fileName}`, 'utf8').split('\n')
      const allChangedLines = []

      linesOfAFile.forEach(line => {
        let newLine = line

        if (line === `${newFile.lookingFor}`) {
          newLine = `${newFile.replacement}`
          foundTheLine.push(true)
        }

        allChangedLines.push(newLine)
        foundTheLine.push(false)
      })

      fs.writeFileSync(
        `${directory}/${newFile.fileName}`,
        allChangedLines.join(newFile.oneLineFile ? '' : '\n'),
        { encoding: 'utf8', flag: 'w+' }
      )

      return foundTheLine.includes(true)
    })

    return !isEverythingOk.includes(false)
  }

  setFiles(filesArray) {
    this.filePaths = filesArray.filter(file => file)
    return this
  }

  setFilePath(filePath) {
    this.filePath = filePath
    return this
  }

  get parsedJson() { return this.fileToJson() }

  get contents() { return this.fileContents() }

  get existance() { return this.checkIfFilesExist() }
}

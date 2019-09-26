const statusLetters = {
  A: {
    description: 'addition of a file',
    name: 'additionToFile'
  },
  C: {
    description: 'copy of a file into a new one',
    name: 'copiedFile'
  },
  D: {
    description: 'deletion of a file',
    name: 'deletionOfFile'
  },
  M: {
    description: 'modification of the contents or mode of a file',
    name: 'modifiedFile'
  },
  R: {
    description: 'renaming of a file',
    name: 'renamedFile'
  },
  T: {
    description: 'change in the type of the file',
    name: 'typeChangedFile'
  },
  U: {
    description: 'file is unmerged (you must complete the merge before it can be committed)',
    name: 'unmergedFile'
  },
  X: {
    description: '"unknown" change type (most probably a bug, please report it)',
    name: 'unknownType'
  },
  '??': {
    description: 'new file',
    name: 'newFile'
  }
}
const availableStatusLetters = ['A', 'C', 'D', 'M', 'R', 'T', 'U', 'X', '??']

module.exports = {
  statusLetters,
  availableStatusLetters
}

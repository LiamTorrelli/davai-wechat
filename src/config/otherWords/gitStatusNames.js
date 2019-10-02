const statusLetters = {
  A: {
    description: 'addition of a file',
    name: 'additionToFile',
    shortName: 'APPENDED'
  },
  C: {
    description: 'copy of a file into a new one',
    name: 'copiedFile',
    shortName: 'COPIED'
  },
  D: {
    description: 'deletion of a file',
    name: 'deletionOfFile',
    shortName: 'DELETED'
  },
  M: {
    description: 'modification of the contents or mode of a file',
    name: 'modifiedFile',
    shortName: 'MODIFIED'
  },
  R: {
    description: 'renaming of a file',
    name: 'renamedFile',
    shortName: 'RENAMED'
  },
  T: {
    description: 'change in the type of the file',
    name: 'typeChangedFile',
    shortName: 'CHANGED TYPE'
  },
  U: {
    description: 'file is unmerged (you must complete the merge before it can be committed)',
    name: 'unmergedFile',
    shortName: 'UNMERGED'
  },
  X: {
    description: '"unknown" change type (most probably a bug, please report it)',
    name: 'unknownType',
    shortName: 'UNKNOWN'
  },
  '??': {
    description: 'new file',
    name: 'newFile',
    shortName: 'ADDED'
  }
}
const availableStatusLetters = ['A', 'C', 'D', 'M', 'R', 'T', 'U', 'X', '??']

export {
  statusLetters,
  availableStatusLetters
}

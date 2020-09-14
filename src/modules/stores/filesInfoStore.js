import { observable, action, autorun } from 'mobx'

// Controllers
import { ShellExecutor } from '../../controllers/shellExecutor'

// Handlers
import { logError } from '../../handlers/outputHandler'
import { FilesService } from '../../services/filesService'

// Helpers
import { __isEmpty } from '../../helpers/help'

const CONFIG_FILE_PATH = 'DAVAI-CONFIG.json'

export const FilesInfoStore = observable({
  STARTUP_FILES: [],
  STARTUP_BRANCH: [],
  VERSION_FILE: '',
  DEV_TOOLS_PATH: '',
  FILES_TO_UPDATE_WITH_VERSION: [],
  GIT_RELEASE_BRANCH_NAME_BASE: '',
  GIT_RELEASE_TAG_NAME_BASE: '',
  DEFAULT_PAGE_PATH: '',
  GIT_INTEGRATION_RELEASE_BRANCH_BASE: '',

  config: false,
  startupFilesExist: false,
  productionFilesAdded: false,
  noProductionsFilesToAdd: false,
  productionFilesDeleted: false,

  getConfigurationFile() {
    try {
      this.config = new FilesService()
        .setFilePath(CONFIG_FILE_PATH)
        .parsedJson

      return this
    } catch (err) { return logError('Getting Configuration File failed:', err) }
  },

  setDefaultPagePath() {
    const { config } = this.getConfigurationFile() || {}

    if (!__isEmpty(config)) {
      const { DEFAULT_PAGE_PATH } = config
      this.DEFAULT_PAGE_PATH = DEFAULT_PAGE_PATH

      return this
    }
    return logError('Setting default page path failed:', 'There was a problem with a config file')
  },

  setIntegrationReleaseBranchBase() {
    const { config } = this.getConfigurationFile() || {}

    if (!__isEmpty(config)) {
      const { GIT_INTEGRATION_RELEASE_BRANCH_BASE } = config
      this.GIT_INTEGRATION_RELEASE_BRANCH_BASE = GIT_INTEGRATION_RELEASE_BRANCH_BASE

      return this
    }
    return logError('Setting integration release branch base failed:', 'There was a problem with a config file')
  },

  checkFilesExistance() {
    const { config } = this.getConfigurationFile() || {}

    if (!__isEmpty(config)) {
      const {
        STARTUP_FILES,
        VERSION_FILE,
        DEV_TOOLS_PATH,
        FILES_TO_UPDATE_WITH_VERSION,
        GIT_RELEASE_BRANCH_NAME_BASE,
        GIT_RELEASE_TAG_NAME_BASE
      } = config

      if (!STARTUP_FILES
      || !VERSION_FILE
      || !DEV_TOOLS_PATH
      || !FILES_TO_UPDATE_WITH_VERSION
      || !GIT_RELEASE_BRANCH_NAME_BASE
      || !GIT_RELEASE_TAG_NAME_BASE
      ) return logError('Reading config file failed', 'Some params are missing')

      this.STARTUP_FILES = STARTUP_FILES
      this.VERSION_FILE = VERSION_FILE
      this.DEV_TOOLS_PATH = DEV_TOOLS_PATH
      this.FILES_TO_UPDATE_WITH_VERSION = FILES_TO_UPDATE_WITH_VERSION
      this.GIT_RELEASE_BRANCH_NAME_BASE = GIT_RELEASE_BRANCH_NAME_BASE
      this.GIT_RELEASE_TAG_NAME_BASE = GIT_RELEASE_TAG_NAME_BASE

      try {
        this.startupFilesExist = true
        // this.startupFilesExist = new FilesService()
        //   .setFiles(STARTUP_FILES)
        //   .existance

        return this
      } catch (err) { return logError('Checking Files Existance failed:', err) }
    } else return logError('Getting Configuration File failed:', 'There was a problem with a config file')
  },

  getStartupBranch() {
    const { config } = this

    if (!__isEmpty(config)) {
      const { STARTUP_BRANCH } = config
      this.STARTUP_BRANCH = STARTUP_BRANCH

      return this
    }
    return logError(
      'Getting Configuration File failed:',
      'There was a problem with a config file'
    )
  },

  async deleteProductionFiles(directory) {
    if (!directory) return logError('Deleting Production Files failed:', 'Project directory was not found')

    const { FILES_TO_ADD_THEN_DELETE = [] } = this

    if (FILES_TO_ADD_THEN_DELETE.length) {
      try {
        const isSuccesful = await new ShellExecutor()
          .deleteFiles(directory, FILES_TO_ADD_THEN_DELETE)

        this.productionFilesDeleted = isSuccesful

        return this
      } catch (err) { return logError('Adding Production Files failed:', err) }
    }

    this.noProductionsFilesToAdd = true
    return this
  },

  async findAndChangeLineInFile({
    directory = null,
    fileName = null,
    findBy = null,
    replaceBy = null
  }) {
    if (!directory || !fileName || !findBy || !replaceBy) return logError(
      'Finding line failed:',
      '(directory | fileName | findBy | replaceBy) was not found'
    )

    const replacedLine = await new FilesService().findAndChangeLineInFile({
      directory,
      fileName,
      findBy,
      replaceBy
    })

    this.replacedLine = replacedLine
    return this
  },

  async updateFilesWithVersion({
    directory,
    newVersion,
    oldVersion,
    type = 'production'
  }) {
    if (!directory
      || !newVersion
      || !oldVersion
    ) return logError('Updating Prod Files Version failed:', '(directory | oldVersion | newVersion was not found')

    const {
      FILES_TO_UPDATE_WITH_VERSION
    } = this

    let filesToWrite = []
    if (type === 'production') filesToWrite = FILES_TO_UPDATE_WITH_VERSION

    const updatedSuccessfully = await new FilesService().updateFilesWithVersion({
      filesToWrite,
      directory,
      oldVersion,
      newVersion
    })

    this.filesUpdatedWithVersion = updatedSuccessfully
    return this
  }

}, {
  getConfigurationFile: action,
  checkFilesExistance: action,
  getStartupBranch: action,
  deleteProductionFiles: action,
  updateFilesWithVersion: action,
  setIntegrationReleaseBranchBase: action,
  findAndChangeLineInFile: action
})

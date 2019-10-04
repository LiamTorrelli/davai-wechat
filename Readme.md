# DAVAI-WECHAT

## Usage
```shell
  davai-wechat [ release | preview | create ]
```
## Description
- `davai-wechat release`
  > Creates a release for Wechat Miniprogram
- `davai-wechat create`
  > Creates a new release branch and cleans files from last release
- `davai-wechat preview`
  > Creates a preview in the folder DAVAI-INFO

## Example DAVAI-CONFIG.json
```json
{
  "DEV_TOOLS_PATH": "/Applications/wechatwebdevtools.app/Contents/MacOS/cli",
  "DEFAULT_PAGE_PATH": ["pages/index/index"],
  "STARTUP_BRANCH": "integration",
  "VERSION_FILE": "VERSION",
  "GIT_RELEASE_BRANCH_NAME_BASE": "COMPANYNAME-RELEASE",
  "GIT_RELEASE_TAG_NAME_BASE": "COMPANYNAME-BUILD",
  "GIT_INTEGRATION_RELEASE_BRANCH_BASE": "INTEGRATION-RELEASE",
  "STARTUP_FILES": [
    "VERSION",
    "app.settings.js",
    "project.config.json",
    "package.json",
    "README.md"
  ],
  "FILES_TO_ADD_THEN_DELETE": ["PRODUCTION.js"],
  "FILES_TO_UPDATE_WITH_VERSION": [
    {
      "fileName": "app.settings.js",
      "lookingFor": "const APP_VERSION ="
    },
    {
      "fileName": "VERSION",
      "lookingFor": ""
    },
    {
      "fileName": "package.json",
      "lookingFor": "version",
      "isJson": true
    }
  ],
  "FILES_TO_UPDATE_WITH_VERSION_AFTER_RELEASE": [
    {
      "fileName": "README.md",
      "lookingFor": "## PRODUCTION RELEASE-",
      "isReadme": true
    }
  ],
  "FILES_TO_UPDATE_WITH_VERSION_NEW_RELEASE": [
    {
      "fileName": "README.md",
      "lookingFor": "## DEVELOPMENT RELEASE-",
      "isNewRelease": true
    }
  ]
}
```
## Config variables decsription

### DEV_TOOLS_PATH
```json
  {
    "DEV_TOOLS_PATH": "/Applications/wechatwebdevtools.app/Contents/MacOS/cli"
    ...
  }

```
> The path to your Wechat devtools application

> Now only mac support **[ issue ]**

****

### DEFAULT_PAGE_PATH
**USED IN [ `preview` ] flow**
```json
  {
    "DEFAULT_PAGE_PATH": ["pages/index/index"],
    ...
  }

```
> This is the default page path for generating a QR code preview

> Need to restart devtools when changing the project **[ issue 4 ]**

****

### STARTUP_BRANCH
**USED IN [ `release` ] and [ `create` ] flows**
```json
  {
    "STARTUP_BRANCH": "integration",
    ...
  }

```
> This is the integration branch in your github repo, from which you start commands

****

### VERSION_FILE
**USED IN [ `release` ] and [ `create` ] flows**
```json
  {
    "VERSION_FILE": "VERSION",
    ...
  }

```
> This is the name of your version file. It is a one line file with a plain version in it **[ issue 8 ]**

****

### BRANCH/TAG NAMES
 - GIT_RELEASE_BRANCH_NAME_BASE
 - GIT_RELEASE_TAG_NAME_BASE
 - GIT_INTEGRATION_RELEASE_BRANCH_BASE

**USED IN [ `release` ] and [ `create` ] flows**
```json
  {
    "GIT_RELEASE_BRANCH_NAME_BASE": "COMPANYNAME-RELEASE",
    "GIT_RELEASE_TAG_NAME_BASE": "COMPANYNAME-BUILD",
    "GIT_INTEGRATION_RELEASE_BRANCH_BASE": "INTEGRATION-RELEASE"
    ...
  }

```
> Names are big and ugly **[ issue 5 ]**

> `GIT_RELEASE_BRANCH_NAME_BASE` **[ `release` - flow ]** this is the branch that will have the PR to master branch

> `GIT_RELEASE_TAG_NAME_BASE` **[ `release` - flow ]** this is the tag name that will be in your repo

> `GIT_INTEGRATION_RELEASE_BRANCH_BASE` **[ `create` - flow ]** this is the integration release branch name, which branches out from your `integration` *(STARTUP_BRANCH)* branch and later makes a PR into your `integration` *(STARTUP_BRANCH)* branch

****

### FILES_TO_ADD_THEN_DELETE
**USED IN [ `release` ] and [ `create` ] flows**
```json
  {
    "FILES_TO_ADD_THEN_DELETE": ["PRODUCTION.js"],
    ...
  }

```
> This is the array of files, that will be added and commited to the project BEFORE the release to Wechat is made in *(GIT_RELEASE_BRANCH_NAME_BASE)* in the **[ `release` - flow ]** and deleted in the **[ `create` - flow ]**, when you start the new release

****

### STARTUP_FILES
**USED IN [ `release` ] and [ `create` ] flows**
```json
  {
    "STARTUP_FILES": [
      "VERSION",
      "app.settings.js",
      "project.config.json",
      "package.json",
      "README.md"
    ],
    ...
  }

```
> This is the array of files, that will be checked before everything
> You need to add all the files you use in the config files, and others, if you would like to **[ issue 9 ]**

****

### FILES_TO_UPDATE_WITH_VERSION
**USED IN [ `release` ] flow**
```json
  {
     "FILES_TO_UPDATE_WITH_VERSION": [
      {
        "fileName": "app.settings.js",
        "lookingFor": "const APP_VERSION ="
      },
      {
        "fileName": "VERSION",
        "lookingFor": ""
      },
      {
        "fileName": "package.json",
        "lookingFor": "version",
        "isJson": true
      }
    ],
    ...
  }
```
> TODO A lot of issues with this one.

> TODO make a documentation, how to parse each type of file

****

### FILES_TO_UPDATE_WITH_VERSION_AFTER_RELEASE
**USED IN [ `release` ] flow**
```json
  {
     "FILES_TO_UPDATE_WITH_VERSION_AFTER_RELEASE": [
      {
        "fileName": "README.md",
        "lookingFor": "## PRODUCTION RELEASE-",
        "isReadme": true
      }
    ],
    ...
  }
```
>  It is MUST HAVE, because you cannot make an empty commit yet **[ issue 10 ]**

> TODO make a documentation, how to parse each type of file

****

### FILES_TO_UPDATE_WITH_VERSION_AFTER_RELEASE
**USED IN [ `create` ] flow**
```json
  {
     "FILES_TO_UPDATE_WITH_VERSION_NEW_RELEASE": [
        {
          "fileName": "README.md",
          "lookingFor": "## DEVELOPMENT RELEASE-",
          "isNewRelease": true
        }
      ]
    ...
  }
```
>  It is MUST HAVE, because you cannot make an empty commit yet **[ issue 10 ]**

> TODO make a documentation, how to parse each type of file

****

## Flow in console output

### **RELEASE**-flow

```bash
  ➜ wechat-miniprogram git:(integration) davai-wechat release

  Project Info store was updated
  Git Info store was updated
  Shell Arguments store was updated
  Files Info store was updated
  Wechat store was updated

    ? Please choose the type of the release > [ fix | feature ]
    ? Please provide the release description > HOTFIX on the combo images heights

  STARTED Start up tasks

  # git output =>
    "
      integration
      Already up to date.
      DeveloperName
    "

    ✔ Checking file(s). Making sure startup file(s) exist(s)
    ✔ Checking the branch name.
    ✔ Setting GIT status files
    ✔ Checking for the current changes localy
    ✔ Merging master into pre-prod branch
    ✔ Setting GIT developer name
    ✔ Setting the VERSION and other project info

  DONE Start up tasks are ready, let's continue

```
```bash
  STARTED Prepare production files

  ✔ Preparing production files
  ✔ Updating production files with new version

  DONE Handeled prepare production files successfully, let's continue`
```
```bash
  STARTED Push production files to PRE-PROD

  # git output =>
    "
      M VERSION
      M app.settings.js
      M package.json
      ?? PRODUCTION.js
    "

  COMMITING

  ❍ Automatic commit by: DeveloperName
  ☐-----------------------------☐
    MODIFIED:  VERSION
    MODIFIED:  app.settings.js
    MODIFIED:  package.json
      ADDED:  PRODUCTION.js
  ☐-----------------------------☐
  Generated: Oct 3rd [ 20:05:00 ]

   # git output =>
    "
      [integration ad087d3] ❍ Automatic commit by: DeveloperName ☐-----------------------------☐   MODIFIED:  VERSION   MODIFIED:  app.settings.js   MODIFIED:  package.json      ADDED:  PRODUCTION.js ☐-----------------------------☐ Generated: Oct 3rd [ 20:05:00 ] 4 files changed, 3 insertions(+), 3 deletions(-) create mode 100644 PRODUCTION.js
    "

  PUSHING COMMIT ON BRANCH [ integration ]

  Wait...

   # git output =>
    "
      To github.com:company/reponame.git
      454e779..ad087d3  integration -> integration
      Branch 'integration' set up to track remote branch 'integration' from 'origin'.
    "

    ✔ Submiting changes to GitHub
  DONE Submitting changes to GitHub successfully, let's continue
```
```bash
  STARTED Create release branch

  Switched to a new branch 'COMPANY-RELEASE-1.21.4'

  # git output =>
    "
      Already up to date.
      Everything up-to-date
      Branch 'integration' set up to track remote branch 'integration' from 'origin'.
    "

    ✔ Creating a release branch
    ✔ Merging PRE-PROD branch into a new release branch

  DONE Switched to release branch successfully, let's continue
```

```bash
  STARTED Handle WeChat release

  # wechat output =>
    "
      Initializing...
      idePortFile: /USERS/username//Library/Application Support/微信开发者工具/Default/.ide
      IDE server has started, listening on http://127.0.0.1:15642
      initialization finished
      initializing login...
    "

  **QR CODE IN CONSOLE**

  **USER SCANS IT**

  # wechat output =>
    "
      login success
      Initializing...
      idePortFile: /USERS/username//Library/Application Support/微信开发者工具/Default/.ide
      IDE server has started, listening on http://127.0.0.1:15642
      initialization finished
      uploading project...

      upload success
    "

    ✔ Log in WeChat Devtools
    ✔ Publishing RELEASE into WeChat

  DONE Handeled WeChat Devtools successfully, let's continue
```

```bash
  STARTED Pushing release tag

  # git output =>
    "
      To github.com:company/reponame.git
      * [new tag]         COMPANY-BUILD-1.21.4 -> COMPANY-BUILD-1.21.4
      COMPANY-RELEASE-1.21.4
    "

  COMMITING

  ❍ RELEASE-1.21.4 ❍ [ fix ]

    Description: HOTFIX on the combo images heights

  ☐----------------------------☐
    ✸ Developer: DeveloperName
    ✸ Date: Oct 3rd 2019 (Thu)
  ☐----------------------------☐

  # git output =>
    "
      [COMPANY-RELEASE-1.21.4 24785c7] ❍ RELEASE-1.21.4 ❍ [ fix ]
      2 files changed, 2 insertions(+), 1 deletion(-)
      create mode 100644 loginResult.json
    "

  PUSHING COMMIT ON BRANCH [ COMPANY-RELEASE-1.21.4 ]

  Wait...

  # git output =>
    "
      remote:
      remote: Create a pull request for 'COMPANY-RELEASE-1.21.4' on GitHub by visiting:
      remote:      https://github.com/company/reponame/pull/new/COMPANY-RELEASE-1.21.4
      remote:
      To github.com:company/reponame.git
      * [new branch]      COMPANY-RELEASE-1.21.4 -> COMPANY-RELEASE-1.21.4

      Branch 'COMPANY-RELEASE-1.21.4' set up to track remote branch 'COMPANY-RELEASE-1.21.4' from 'origin'.
    "
    ✔ Creating release tag
    ✔ Pushing release tag
    ✔ Updating files with new version after release
    ✔ Committing after release is done

  DONE Pushing release tag successfully, let's continue
```
```bash
  _______________________________________________

      RELEASE 1.21.4 was uploaded to Wechat
  _______________________________________________


   __________   ________  ___                  ___  ______________
  |___    ___| |   _____| \  \                /  / |_____    _____|
      |  |     |  |        \  \      __      /  /        |  |
      |  |     |  |         \  \    /  \    /  /         |  |
      |  |     |  |          \  \  /    \  /  /          |  |
      |  |     |  |           \  \/  /\  \/  /           |  |
   ___|  |___  |  |_________   \    /  \    /            |  |
  |__________| |____________|   \__/    \__/             |__|


  DONE THE NEW VERSION WAS RELEASED TO WECHAT!
```

### **CREATE**-flow

```bash
  ➜ wechat-miniprogram git:(integration) davai-wechat create

  Project Info store was updated
  Git Info store was updated
  Shell Arguments store was updated
  Files Info store was updated
  Wechat store was updated

    ? Please provide the new release version (0.0.1) > 1.21.5


  STARTED Start up tasks
  # git output =>
    "
      integration
      Already up to date.
      DeveloperName
    "

    ✔ Checking file(s). Making sure startup file(s) exist(s)
    ✔ Checking the branch name.
    ✔ Setting GIT status files
    ✔ Checking for the current changes localy
    ✔ Merging master into pre-prod branch
    ✔ Setting GIT developer name
    ✔ Setting the VERSION and other project info

  DONE Start up tasks are ready, let's continue

```
```bash
  STARTED Create new release branch
  # git output =>
    "
      From github.com:company/reponame
      * branch            master     -> FETCH_HEAD
        87fea58..c387338  master     -> origin/master
      Updating ad087d3..c387338

      Fast-forward
      README.md        | 2 +-
      loginResult.json | 1 +
      2 files changed, 2 insertions(+), 1 deletion(-)
      create mode 100644 loginResult.json

      Already up to date.
      To github.com:company/reponame.git
        ad087d3..c387338  integration -> integration
      Branch 'integration' set up to track remote branch 'integration' from 'origin'.

      Switched to a new branch 'INTEGRATION-RELEASE-1.21.5'
      remote:
      remote: Create a pull request for 'INTEGRATION-RELEASE-1.21.5' on GitHub by visiting:
      remote:      https://github.com/company/reponame/pull/new/INTEGRATION-RELEASE-1.21.5

      remote:

      To github.com:company/reponame.git
      * [new branch]      INTEGRATION-RELEASE-1.21.5 -> INTEGRATION-RELEASE-1.21.5
      Branch 'INTEGRATION-RELEASE-1.21.5' set up to track remote branch 'INTEGRATION-RELEASE-1.21.5' from 'origin'.
    "

    ✔ Merging PRE-PROD branch into a new release branch
    ✔ Creating a release branch

  DONE Switched to a new release branch successfully, let's continue

```
```bash
  STARTED Clean up production files

    ✔ Deleting production files

  DONE Cleaning up production files successfully, let's continue

```
```bash
  STARTED Submit changes to github
  # git output =>
    "
      INTEGRATION-RELEASE-1.21.5
      D PRODUCTION.js
    "

  COMMITING

  ❍ Automatic commit by: DeveloperName
  ☐-------------------------☐
    DELETED:  PROUCTION.js
  ☐-------------------------☐
  Generated: Oct 4th [ 15:08:00 ]

  # git output =>
    "
      [INTEGRATION-RELEASE-1.21.5 d9a6c05] ❍ Automatic commit by: DeveloperName ☐-------------------------☐   DELETED:  PROUCTION.js ☐-------------------------☐ Generated: Oct 4th [ 15:08:00 ]
      1 file changed, 0 insertions(+), 0 deletions(-)
      delete mode 100644 PRODUCTION.js
    "

  PUSHING COMMIT ON BRANCH [ INTEGRATION-RELEASE-1.21.5 ]

  Wait...

  # git output =>
    "
      To github.com:company/reponame.git
        c387338..d9a6c05  INTEGRATION-RELEASE-1.21.5 -> INTEGRATION-RELEASE-1.21.5

      Branch 'INTEGRATION-RELEASE-1.21.5' set up to track remote branch 'INTEGRATION-RELEASE-1.21.5' from 'origin'.

      INTEGRATION-RELEASE-1.21.5
      M README.md
    "

  COMMITING

  ❍ STARTED INTEGRATION-RELEASE-1.21.5 ❍

  ☐------------------------------☐
    ✸ Developer: DeveloperName
    ✸ Date: Oct 4th [ 15:08:00 ]
  ☐------------------------------☐

  # git output =>
    "
      [INTEGRATION-RELEASE-1.21.5 e6df6d0] ❍ STARTED INTEGRATION-RELEASE-1.21.5 ❍
      1 file changed, 1 insertion(+), 1 deletion(-)
    "

  PUSHING COMMIT ON BRANCH [ INTEGRATION-RELEASE-1.21.5 ]

  Wait...

  # git output =>
    "
      To github.com:company/reponame.git
        d9a6c05..e6df6d0  INTEGRATION-RELEASE-1.21.5 -> INTEGRATION-RELEASE-1.21.5
      Branch 'INTEGRATION-RELEASE-1.21.5' set up to track remote branch 'INTEGRATION-RELEASE-1.21.5' from 'origin'.
    "

    ✔ Submiting changes to GitHub
    ✔ Updating files with new version in a new release
    ✔ Committing after creating a new release branch

  DONE Submitting changes to github successfully, let's continue
```
```bash
  _______________________________________________

      INTEGRATION-RELEASE-1.21.5 was created
  _______________________________________________


   __________   ________  ___                  ___  ______________
  |___    ___| |   _____| \  \                /  / |_____    _____|
      |  |     |  |        \  \      __      /  /        |  |
      |  |     |  |         \  \    /  \    /  /         |  |
      |  |     |  |          \  \  /    \  /  /          |  |
      |  |     |  |           \  \/  /\  \/  /           |  |
   ___|  |___  |  |_________   \    /  \    /            |  |
  |__________| |____________|   \__/    \__/             |__|


  DONE THE NEW RELEASE BRANCH WAS CREATED!
```

****

## Known issues
1) **No tests**
2) **Useless methods that are not called**
3) **Dirty console output**
4) **Wechat devtools cli bugs** *(need to open issue in their repo)*
 - Need to restart devtools when changing the project, so that the default preview path will be changed
 - Every time you build the preview the project in devtools will be closed, because the changes in your wxml and css files will not be sensed. JS, however works with no problem
5) **Ugly config file**
  - The names are too long and ugly
  - Some config variables need to be set as defult in the project, without having them written in the config file
6) **No Windows support**
7) **Did not test BitBucket or GitLab yet**
8) **Version file HAS to be a one-line**
  - Version file needs to be any type you want (one-line, json, readme)
9) **Files that are used in the config, needs to be checked without having to add them in the `STARTUP_FILES`**
10) **`FILES_TO_UPDATE_WITH_VERSION_AFTER_RELEASE` and `FILES_TO_UPDATE_WITH_VERSION_NEW_RELEASE` are important, because you cannot make an empty commit yet**
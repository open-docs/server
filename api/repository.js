// import GIT from 'nodegit'
import path from 'path'
import fs from 'fs'
const REPOPATH = process.env.REPO_PATH

export default class GITRepo {

  getContent (id) {
    return fs.promises.readFile(path.join(REPOPATH, id))
  }

  writeContent (id, data, message) {
    return fs.promises.writeFile(path.join(REPOPATH, id), data)
  }

}

import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { downloadFile } from './download'
import { unzipFile } from './unzip'
import { walkAdvisories } from './walker'

const DATABASE_URL = "https://github.com/github/advisory-database/archive/refs/heads/main.zip"
const UNZIPED_DATABASE = path.join(os.tmpdir(), "advisory-database")
const ZIPED_DATABASE = path.join(UNZIPED_DATABASE + ".zip")


const downloadDatabase = async (): Promise<void> => {

  console.log("Downloading github advisory database")
  await downloadFile(DATABASE_URL, ZIPED_DATABASE)

  console.log("Unzipping...")
  await unzipFile(ZIPED_DATABASE, UNZIPED_DATABASE)
}

const createProcessedDatabasesFolder = () => {
  const dir_path = path.join(__dirname, "..", "output")

  if (fs.existsSync(dir_path))
    fs.rmdirSync(dir_path, { recursive: true })

  fs.mkdirSync(dir_path)

  return dir_path
}

const main = async () => {

  await downloadDatabase()

  const db: any = {}

  console.log("Processing advisories...")
  const d = path.join(UNZIPED_DATABASE, "advisory-database-main", "advisories", "github-reviewed")
  await walkAdvisories(d, async (filePath: string, adv: any) => {

    const ecosystem = adv.affected[0].package.ecosystem
    if (!Object.keys(db).includes(ecosystem))
      db[ecosystem] = []

    db[ecosystem].push(adv)
  })

  const output = createProcessedDatabasesFolder()

  Object.keys(db).forEach((ecosystem) => {
    fs.writeFileSync(path.join(output, ecosystem + ".json"), JSON.stringify(db[ecosystem], null, 2))
  })

}

main()

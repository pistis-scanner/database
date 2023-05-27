import * as fs from "fs"
import * as path from "path"
import { walkAdvisories } from './Walker'


const main = async () => {
  const tmp = path.join(__dirname, "..", "tmp")
  const our_advisories_path = path.join(__dirname, "..", "..", "advisories")

  const db: any = {}

  await walkAdvisories(our_advisories_path, async (filePath: string, adv: any) => {
    const ecosystem = adv.affected[0].package.ecosystem
    if (!Object.keys(db).includes(ecosystem))
      db[ecosystem] = []

    db[ecosystem].push(adv)
  })

  Object.keys(db).forEach((ecosystem) => {
    fs.writeFileSync(path.join(tmp, "processed_databases", ecosystem + ".json"), JSON.stringify(db[ecosystem], null, 2))
  })

}

main()

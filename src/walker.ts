import fs from 'fs'
import path from 'path'

export const walkAdvisories = async (dirPath: string, callback: (filename: string, advisory: any) => Promise<void>) => {

  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    if (fs.statSync(dirPath + "/" + file).isDirectory())
      await walkAdvisories(dirPath + "/" + file, callback)
    else {
      if (file.match(/^GHSA-.*\.json$/)) {
        const filePath = path.join(dirPath, file)
        const adv = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        await callback(filePath, adv)
      }
    }
  }
}

import fs from 'fs'
import path from 'path'
import { ChatGpt } from './ChatGpt'
import { walkAdvisories } from './Walker'


const API_KEY = ""
const chatGpt = new ChatGpt(API_KEY)


// This file reads the github database from tmp folder and generates the db on our format in the database/advisories folder
// The format is basically the same, but we add a new field called database_specific.vulnerable_methods

const main = async () => {

  const github_advisories_path = path.join(__dirname, "..", "tmp", "advisory-database", "advisories", "github-reviewed", "2023")
  const our_advisories_path = path.join(__dirname, "..", "..", "advisories")
  const ignoredAdvsFile = "tmp/ignored.txt"

  if (fs.existsSync(ignoredAdvsFile))
    fs.unlinkSync(ignoredAdvsFile)

  await walkAdvisories(github_advisories_path, async (filePath: string, adv: any) => {
    console.log(`Processing ${path.basename(filePath)}`)

    const content = `${adv.summary}:\n${adv.details}`
    const relativePath = filePath.replace(github_advisories_path, "")

    // prepare advisory with our new fields
    const response = (await chatGpt.parseAdvisory(content)).replace(/\n/g, "")
    adv.database_specific ||= {}


    // chatgpt gives a few false positives, so we are trying to filter results by checking for files without extension, or files/methods with spaces
    // also check if the response is in the advisory
    let possibleMethod = null
    if (response.trim() == ".")
      possibleMethod = null
    else if (response?.includes(" ")) {
      console.error("Reported method with spaces, ignoring", response)
      fs.appendFileSync(ignoredAdvsFile, `${relativePath}: ${response}\n`)
    }
    else
      possibleMethod = adv.details.includes(response) || adv.summary.includes(response) ? response : null


    if (possibleMethod) {
      console.log(possibleMethod)
      adv.database_specific.vulnerable_methods = [possibleMethod.replace("()", "")]
    }


    // write advisory to our database
    const finalPath = path.join(our_advisories_path, "2023", relativePath)
    const finalDir = path.dirname(finalPath)

    if (!fs.existsSync(finalDir))
      fs.mkdirSync(finalDir, { recursive: true })

    fs.writeFileSync(path.join(finalPath), JSON.stringify(adv, null, 2))

  })

  // const adv = "All versions of the package is-http2 are vulnerable to Command Injection due to missing input sanitization or other checks, and sandboxes being employed to the isH2 function."
  // const response = await chatGpt.parseAdvisory(adv)
  // console.log(response)

}

main()

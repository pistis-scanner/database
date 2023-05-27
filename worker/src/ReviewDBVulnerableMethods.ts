import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { walkAdvisories } from './Walker'

const readInput = async (prompt: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    //output: process.stdout
  })

  return new Promise<string>((resolve, reject) => {
    console.log(prompt)
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

const main = async () => {
  const tmp = path.join(__dirname, "..", "tmp")
  const our_advisories_path = path.join(__dirname, "..", "..", "advisories")

  const db: any = {}


  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const advs: any[] = []

  await walkAdvisories(our_advisories_path, async (filePath: string, adv: any) => {
    advs.push({ filePath, adv })
  })


  const advsWithMethods = advs.filter((adv) => adv.adv.database_specific?.vulnerable_methods?.length > 0)

  for (let i = 0; i < advsWithMethods.length; i++) {
    const { filePath, adv } = advsWithMethods[i]

    console.log("=".repeat(20))
    console.log(`${i} of ${advsWithMethods.length}`)
    console.log(`ID: ${adv.id}`)
    console.log(`Title: ${adv.summary}`)
    console.log(`Methods: ${adv.database_specific.vulnerable_methods}`)
    console.log()
    console.log(`Description: ${adv.details}`)

    console.log()
    const val = await readInput("Is this correct? if so press y, otherwise set override value: ")
    if (val !== "y") {

      if (val.trim() === "")
        adv.database_specific.vulnerable_methods = []
      else
        adv.database_specific.vulnerable_methods = [val]

      fs.writeFileSync(filePath, JSON.stringify(adv, null, 2))
    }


    console.log("\n \n \n \n \n \n \n \n \n \n \n")
    console.clear()
  }

}


main()

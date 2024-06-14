import * as fs from "fs"
import { Readable } from 'stream'
import { finished } from 'stream/promises'

export const downloadFile = async (url: string, outputPath: string) => {
    const res = await fetch(url)

    if (fs.existsSync(outputPath))
        fs.unlinkSync(outputPath)

    const fileStream = fs.createWriteStream(outputPath, { flags: 'wx' })
    await finished(Readable.fromWeb(res.body as any).pipe(fileStream))
}


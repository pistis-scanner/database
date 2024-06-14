import * as fs from 'fs'
import * as path from 'path'
import * as yauzl from 'yauzl'

// copied directly from chatgpt
export function unzipFile(zipFilePath: string, outputDir: string) {
    return new Promise((resolve, reject) => {

        if (fs.existsSync(outputDir))
            fs.rmdirSync(outputDir, { recursive: true })

        yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
            if (err) reject(err)

            // Make the output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            zipfile.readEntry()

            zipfile.on('entry', (entry) => {
                const filePath = path.join(outputDir, entry.fileName)

                // Directory entry handling
                if (/\/$/.test(entry.fileName)) {
                    fs.mkdir(filePath, { recursive: true }, (err) => {
                        if (err) reject(err)
                        zipfile.readEntry()
                    })
                } else {
                    // File entry handling
                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err) reject(err)

                        readStream.on('end', () => {
                            zipfile.readEntry()
                        })

                        // Ensure directory exists before writing the file
                        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
                            if (err) reject(err)
                            readStream.pipe(fs.createWriteStream(filePath))
                        })
                    })
                }
            })

            zipfile.on('end', resolve)
        })
    })
}

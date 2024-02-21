import { mkdirSync, readdirSync, writeFileSync } from "fs"
import * as path from "path"
import sharp from "sharp"
import { pick } from "../src/common/object"
import { imageTypesRegex } from "./images-go"

export async function main(sourceDir: string, outputFile: string, finalImageSrcBaseUrl: string) {
    console.log(`\nReading images from ${sourceDir}\n`)

    const outputFileAbsolute = path.join(sourceDir, outputFile)

    let tasks = readdirSync(sourceDir)
        // keep-line
        .filter((file) => file.match(imageTypesRegex))
        .map((file) => processOne(path.join(sourceDir, file), finalImageSrcBaseUrl))
    const results = await Promise.all(tasks)

    console.log(`\nWriting results to ${outputFileAbsolute}\n`)

    writeOutputFile(outputFileAbsolute, results)

    console.log(`\nDONE\n`)
}

async function processOne(file: string, finalImageSrcBaseUrl: string) {
    const metadata = await sharp(file).metadata()
    const selectedMetadata = pick(["width", "height", "format", "orientation"], metadata)

    const fileName = path.basename(file)
    return { src: `${finalImageSrcBaseUrl}/${fileName}`, ...selectedMetadata }
}

function writeOutputFile(outputFile: string, content: unknown[]) {
    let outputFileDir = path.dirname(outputFile)
    mkdirSync(outputFileDir, { recursive: true })
    writeFileSync(outputFile, JSON.stringify(content, null, 2), {})
}

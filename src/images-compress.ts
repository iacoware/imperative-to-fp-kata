import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    rmSync,
    statSync,
} from "fs"
import * as path from "path"
import sharp from "sharp"
import { imageTypesRegex } from "./index"
import { Effect } from "effect"
import { FileSystem } from "@effect/platform"

const WIDTH_THRESHOLD = 1500

export class CompressError {
    readonly _tag = "CompressError"
}

export function compress(sourceDir: string, outputDir: string) {
    return Effect.gen(function* (_) {
        const fs = yield* _(FileSystem.FileSystem)

        yield* _(
            Effect.tryPromise({
                try: () => main(sourceDir, outputDir),
                catch: () => new CompressError(),
            }),
        )
    })
}

export async function main(sourceDir: string, outputDir: string) {
    if (!existsSync(sourceDir)) {
        console.error(`\nSource directory ${sourceDir} does not exist\n`)
        process.exit(1)
    }

    console.log(`\nReading images from ${sourceDir}\n`)

    const outputDirAbsolute = path.join(sourceDir, outputDir)
    rmSync(outputDirAbsolute, { recursive: true, force: true })
    mkdirSync(outputDirAbsolute, { recursive: true })

    const tasks = readdirSync(sourceDir)
        // keep-line
        .filter((file) => file.match(imageTypesRegex))
        .map((file) =>
            processOne(path.join(sourceDir, file), outputDirAbsolute),
        )
    const results = await Promise.all(tasks)

    // throw new Error("WTF?")

    console.log(`\nProcessed ${results.length} images \n`)
    console.log(`\nDONE\n`)
}

async function processOne(inputFile: string, outputDir: string) {
    const fileName = path.basename(inputFile)
    const outputFile = path.join(outputDir, `${fileName}.webp`)

    const metadata = await sharp(inputFile).metadata()
    const stat = statSync(inputFile)
    const sizeInKb = stat.size / 1024

    if (sizeInKb < 50 || !metadata.width || metadata.width < WIDTH_THRESHOLD) {
        copyFileSync(inputFile, outputFile)
        return { name: outputFile }
    } else {
        const info = await sharp(inputFile)
            .resize({ width: WIDTH_THRESHOLD, withoutEnlargement: true })
            .withMetadata()
            .webp({ lossless: false, quality: 80 })
            .toFile(outputFile)
        return { name: outputFile, ...info }
    }
}

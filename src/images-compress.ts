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
import { Data, Effect } from "effect"
import * as ROA from "effect/ReadonlyArray"
import { FileSystem } from "@effect/platform"
import { pipe } from "effect/Function"

const WIDTH_THRESHOLD = 1500

export class CompressError extends Data.TaggedError("CompressError")<{
    message: string
}> {}

export function compress(sourceDir: string, outputDir: string) {
    return Effect.gen(function* (_) {
        const fs = yield* _(FileSystem.FileSystem)

        const sourceDirExists = yield* _(fs.exists(sourceDir))
        if (!sourceDirExists) {
            const message = `Source directory ${sourceDir} does not exist`
            console.error(`\n${message}\n`)
            yield* _(new CompressError({ message }))
        }

        console.log(`\nReading images from ${sourceDir}\n`)

        const outputDirAbsolute = path.join(sourceDir, outputDir)
        const outputDirExists = yield* _(fs.exists(outputDirAbsolute))
        if (outputDirExists)
            yield* _(fs.remove(outputDirAbsolute, { recursive: true }))

        yield* _(fs.makeDirectory(outputDirAbsolute, { recursive: true }))

        const onlyImages = yield* _(
            fs.readDirectory(sourceDir),
            Effect.map(ROA.filter((file) => !!file.match(imageTypesRegex))),
        )

        const results = yield* _(
            onlyImages,
            Effect.forEach(
                (file) =>
                    processOneF(path.join(sourceDir, file), outputDirAbsolute),
                { concurrency: "unbounded" },
            ),
        )

        console.log(`\nProcessed ${results.length} images \n`)
        console.log(`\nDONE\n`)
    })
}

function processOneF(inputFile: string, outputDir: string) {
    return Effect.gen(function* (_) {
        yield* _(
            Effect.tryPromise({
                try: () => processOne(inputFile, outputDir),
                catch: () =>
                    new CompressError({
                        message: `Error processing ${inputFile}`,
                    }),
            }),
        )
    })
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

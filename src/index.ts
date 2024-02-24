import { main as compress } from "./images-compress"
import { main as writeJson } from "./images-json"
import * as path from "path"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import { Console } from "effect"

export const imageTypesRegex = /\.(png|jpeg|jpg|webp)$/i
const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = new URL(sourceDirRelative, import.meta.url).pathname
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

class CompressError {
    readonly _tag = "CompressError"
}
class WriteJsonError {
    readonly _tag = "WriteJsonError"
}

const app = Effect.gen(function* (_) {
    console.log("jsonOutputFile", jsonOutputFile)
    console.log("final images src", finalImageSrcBaseUrl)

    yield* _(
        Effect.tryPromise({
            try: () => compress(sourceDirAbsolute, compressOutputDir),
            catch: () => new CompressError(),
        }),
    )

    yield* _(
        Effect.tryPromise({
            try: () =>
                writeJson(
                    processedDirAbsolute,
                    jsonOutputFile,
                    finalImageSrcBaseUrl,
                ),
            catch: () => new WriteJsonError(),
        }),
    )
})

const program = pipe(
    app,
    Effect.tapErrorTag("CompressError", () =>
        Console.log("Failed to compress images"),
    ),
    Effect.tapErrorTag("WriteJsonError", () =>
        Console.log("Failed to write json"),
    ),
    Effect.catchAll(() => Effect.sync(() => process.exit(1))),
)

await Effect.runPromise(program)

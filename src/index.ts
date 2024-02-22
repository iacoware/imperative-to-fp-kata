import { main as compress } from "./images-compress"
import { main as writeJson } from "./images-json"
import * as path from "path"
import * as Effect from "effect/Effect"
import * as F from "effect/Function"

export const imageTypesRegex = /\.(png|jpeg|jpg|webp)$/i
const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = new URL(sourceDirRelative, import.meta.url).pathname
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

const app2 = Effect.gen(function* (_) {
    yield* _(
        Effect.promise(() => compress(sourceDirAbsolute, compressOutputDir)),
    )

    yield* _(
        Effect.promise(() =>
            writeJson(
                processedDirAbsolute,
                jsonOutputFile,
                finalImageSrcBaseUrl,
            ),
        ),
    )
})

const app = F.pipe(
    Effect.promise(() => compress(sourceDirAbsolute, compressOutputDir)),
    Effect.flatMap(() =>
        Effect.promise(() =>
            writeJson(
                processedDirAbsolute,
                jsonOutputFile,
                finalImageSrcBaseUrl,
            ),
        ),
    ),
)

await Effect.runPromise(app2)
// await Effect.runPromise(app)

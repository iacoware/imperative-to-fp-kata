import { compress } from "./images-compress"
import { writeJson } from "./images-json"
import * as path from "path"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import { Console } from "effect"
import { NodeContext, NodeFileSystem } from "@effect/platform-node"

export const imageTypesRegex = /\.(png|jpeg|jpg|webp)$/i
const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = new URL(sourceDirRelative, import.meta.url).pathname
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

const app = Effect.gen(function* (_) {
    yield* _(compress(sourceDirAbsolute, compressOutputDir))

    yield* _(
        writeJson(processedDirAbsolute, jsonOutputFile, finalImageSrcBaseUrl),
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

const runnable = pipe(program, Effect.provide(NodeFileSystem.layer))

await Effect.runPromise(runnable)

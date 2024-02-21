import { main as compress } from "./images-compress"
import { main as writeJson } from "./images-json"
import * as path from "path"

export const imageTypesRegex = /\.(png|jpeg|jpg|webp)$/i
const sourceDirRelative = "./public/team-photos"
const sourceDirAbsolute = new URL(sourceDirRelative, import.meta.url).pathname
const compressOutputDir = "processed"

const processedDirAbsolute = path.join(sourceDirAbsolute, compressOutputDir)
const finalImageSrcBaseUrl = `/team-photos/${compressOutputDir}`
const jsonOutputFile = "images.json"

await compress(sourceDirAbsolute, compressOutputDir)
await writeJson(processedDirAbsolute, jsonOutputFile, finalImageSrcBaseUrl)

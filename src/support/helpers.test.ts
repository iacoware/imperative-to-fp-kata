import { expect, test } from "vitest"
import { delay } from "./helpers"

test("it works", async () => {
    await delay(100)
    expect("a").toBe("a")
})

export const delay = (ms: number): Promise<number> =>
    new Promise((resolve) => setTimeout(() => resolve(ms), ms))

export const pretty = (obj: unknown) => JSON.stringify(obj, null, 2)

export const arrayFrom = (start: number, count: number) =>
    Array.from({ length: count }).map((_, i) => i + start)

// https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors
const RESET = "\x1b[0m"
const GREEN = "\x1b[32m"
const CYAN = "\x1b[36m"
const RED = "\x1b[31m"
const YELLOW = "\x1b[33m"
const WHITE = "\x1b[37m"

export const green = (message: string): string => `${GREEN}${message}${RESET}`
export const red = (message: string): string => `${RED}${message}${RESET}`
export const cyan = (message: string): string => `${CYAN}${message}${RESET}`
export const yellow = (message: string): string => `${YELLOW}${message}${RESET}`
export const white = (message: string): string => `${WHITE}${message}${RESET}`

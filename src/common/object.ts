export function pick<T, K extends keyof T>(props: K[], obj: T) {
    return props.reduce(
        (acc, prop) => {
            acc[prop] = obj[prop]
            return acc
        },
        {} as Pick<T, K>,
    )
}

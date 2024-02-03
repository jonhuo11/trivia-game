export const ObjectReplace = (original:any, replacer:any) => {
    for (let key in replacer) {
        if (key in original && replacer[key] !== null && replacer[key] !== undefined) {
            original[key] = replacer[key]
        }
    }
}
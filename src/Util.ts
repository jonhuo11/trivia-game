// replaces all values of keys which exist in original with values in replacer. Keys in replacer but not in original are not added
export const ObjectReplace = (original:any, replacer:any) => {
    for (let key in replacer) {
        if (key in original && replacer[key] !== null && replacer[key] !== undefined) {
            //console.log("Replaced in original", key)
            original[key] = replacer[key]
        }
    }
}

const alpha = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('');

export const numToAlpha = (num:number) => {
    if (num === -1) {
        return "?"
    }
    if (num < 1 || num > alpha.length) {
        throw new Error("invalid range for num to alpha");
    }

    return alpha[num - 1];
}
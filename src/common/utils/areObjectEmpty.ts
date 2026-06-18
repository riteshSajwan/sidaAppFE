function areObjectEmpty<T extends Record<string, string>>(obj: T): boolean {
    return Object.values(obj).every((value) => {
        return value.trim() === '';
    });
}

export {
    areObjectEmpty,
}


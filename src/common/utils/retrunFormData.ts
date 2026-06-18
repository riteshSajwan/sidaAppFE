export type objectType = string | Blob | File | undefined;

function returnFormData<T extends Record<string, objectType>>(
    obj: T,
    filename?: string,
): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
        if(value) {
        if (typeof value === 'string') {
            formData.append(key, value);
        } else {
            formData.append(key, value);
        }
    }
    });

    return formData;
}

export {
    returnFormData,
}


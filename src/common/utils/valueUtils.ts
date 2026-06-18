type Value = string | undefined | null;

function getFirstAvailableValue(primary: Value, fallback: Value) {
    return primary || fallback || '';
}

function getStringOrEmpty(value: Value) {
    return value || '';
}

function stringToBoolean(value: string | null) {
 return value === 'true';
}

export {
    getFirstAvailableValue,
    getStringOrEmpty,
    stringToBoolean,
}

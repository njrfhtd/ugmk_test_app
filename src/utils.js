export const roundValue = (num, decimals = 2) => {
    let scaling = 10 ** decimals;
    return Math.round((num + Number.EPSILON) * scaling) / scaling;
}

export const getRoundValue = (value, decimals = 2) => {
    return (value >= 1) ? Math.round(value) : roundValue(value, decimals);
}

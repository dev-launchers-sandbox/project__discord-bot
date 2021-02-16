module.exports = level => {
    // TODO: Decide if rounding is needed or not.
    return Math.round(0.5 * (level ** 2)) + (level ** 3);
}
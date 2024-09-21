/**
 * @template {{}} T
 * @param {T[]} data
 * @param {{[key in keyof T]?: T[key]}} filter
 * @returns {T[]}
 */
function search(data, filter) {
    return data.filter((e) => {
        let rl = true;
        Object.keys(filter).forEach((key) => {
            if (filter[key] === undefined) return;
            if (!('' + e[key]).toUpperCase().includes(('' + filter[key]).toUpperCase())) rl = false;
        });

        return rl;
    });
}

export default search;

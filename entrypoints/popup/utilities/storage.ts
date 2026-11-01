export function checkDuplicate(domain: string, list: string[]) {
    const result = { ok: false, error: "" }

    if (list.includes(domain)) {
        result.error = "Already blocked";
        return result;
    }

    const parent = list.find((d) => domain.endsWith(`.${d}`));
    if (parent) {
        result.error = `Already covered by ${parent}`;
        return result;
    }

    result.ok = true;
    return result;
}
import punycode from "punycode";

const ALLOWED_PROTOCOL = ["https", "http"];
const LOCALHOST = ["localhost", "192.168.1.1"];

export function normalizeDomain(urlString: string): string {
    const url = urlString.trim().toLowerCase();

    const protocolSplit = url.split("://");
    const hasProtocol = protocolSplit.length > 1;
    if (hasProtocol) {
        const protocol = protocolSplit[0] || "";
        if (!ALLOWED_PROTOCOL.includes(protocol)) {
            throw new Error("This page can't be blocked")
        }
    }
    const urlWithoutProtocol = protocolSplit[protocolSplit.length - 1];
    if (!urlWithoutProtocol) {
        throw new Error("Invalid url");
    }

    const pathSplit = urlWithoutProtocol.split("/");
    const urlWithoutPath = pathSplit[0];
    if (!urlWithoutPath) {
        throw new Error("Invalid url");
    }

    const portSplit = urlWithoutPath.split(":");
    const urlWithoutPort = portSplit[0];
    if (!urlWithoutPort) {
        throw new Error("Invalid url");
    }

    const domainSplit = urlWithoutPort.split('.');
    if (domainSplit[0] == "www") {
        domainSplit.splice(0, 1);
    }
    const exactDomain = domainSplit.filter(p => p).join('.');

    const domain = punycode.toASCII(exactDomain);
    const validationResult = validateDomain(domain);
    if (!validationResult.ok) {
        throw new Error(validationResult.error);
    }

    return domain;
}

export function validateDomain(domainString: string): ({ ok: boolean, error: string }) {
    const result = { ok: false, error: "" }

    const domain = domainString.trim();
    if (domain.length == 0) {
        result.error = "Please enter a website url";
        return result;
    }

    if (LOCALHOST.includes(domain || "")) {
        result.error = "This page can't be blocked"
        return result;
    }

    const [domainName, tld] = domain.split(".");
    if (!tld) {
        result.error = "Invalid url";
        return result;
    }

    const cleanDomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
    if (!cleanDomainRegex.test(domainName || "")) {
        result.error = "Invalid url";
        return result;
    }

    result.ok = true;
    return result;
}
import { describe, expect, it } from 'vitest'
import { normalizeDomain, validateDomain } from '../../utilities/url'

describe("normalizeDomain", () => {
    it.each([
        ["keeps a bare domain unchanged", "example.com", "example.com"],
        ["strips the https protocol", "https://example.com", "example.com"],
        ["strips the http protocol", "http://example.com", "example.com"],
        ["strips path, query string, and hash from a full URL", "https://www.example.com/path?q=1#top", "example.com"],
        ["removes the www prefix", "www.example.com", "example.com"],
        ["converts the domain to lowercase", "EXAMPLE.COM", "example.com"],
        ["trims leading and trailing whitespace", " example.com ", "example.com"],
        ["removes the port number", "example.com:8080", "example.com"],
        ["removes the trailing dot", "example.com.", "example.com"],
        ["keeps subdomains other than www", "mail.example.com", "mail.example.com"],
        ["keeps multi-part TLDs intact", "bbc.co.uk", "bbc.co.uk"],
        ["converts internationalized domains to punycode", "例え.jp", "xn--r8jz45g.jp"],
    ])("%s: normalizeDomain(%s) => %s", (_name, input, expected) => {
        expect(normalizeDomain(input)).toBe(expected);
    });

    it.each([
        ["rejects chrome internal pages", "chrome://settings", "This page can't be blocked"],
        ["rejects local file URLs", "file:///C:/test.html", "This page can't be blocked"],
        ["rejects extension URLs", "chrome-extension://abcdefghijklmnopabcdefghijklmnop/popup.html", "This page can't be blocked"],
        ["rejects unsupported protocols", "ftp://example.com", "This page can't be blocked"],
    ])("%s", (_name, input, expectedError) => {
        expect(() => normalizeDomain(input)).toThrow(expectedError)
    });
});

describe("validateDomain", () => {
    it.each([
        ["rejects empty or whitespace-only input", "  ", "Please enter a website url"],
        ["rejects a domain without a TLD", "example", "Invalid url"],
        ["rejects a domain containing spaces", "exa mple.com", "Invalid url"],
        ["rejects a domain with illegal characters", "exa_mple!.com", "Invalid url"],
        ["rejects a label that starts or ends with a hyphen", "-example.com", "Invalid url"],
        ["rejects a domain or label that exceeds the length limit", "a".repeat(64) + '.com', "Invalid url"],
        ["rejects localhost and IP addresses", "localhost", "This page can't be blocked"],
        ["rejects localhost and IP addresses", "192.168.1.1", "This page can't be blocked"]
    ])("%s", (_name, input, expectedError) => {
        const result = validateDomain(input);
        expect(result.ok).toBe(false);
        expect(result.error).toBe(expectedError);
    });
})
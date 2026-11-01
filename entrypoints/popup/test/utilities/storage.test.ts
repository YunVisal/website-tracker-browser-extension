import { describe, expect, it } from "vitest";
import { checkDuplicate } from "../../utilities/storage";
import { normalizeDomain } from "../../utilities/url";

describe('checkDuplicate', () => {
    it('rejects a domain that is already blocked', () => {
        expect(checkDuplicate('example.com', ['example.com'])).toEqual({
            ok: false,
            error: 'Already blocked',
        });
    });

    it('detects duplicates after normalization', () => {
        const domain = normalizeDomain('https://WWW.Example.com/abc');
        expect(domain).toBe('example.com');
        expect(checkDuplicate(domain, ['example.com'])).toEqual({
            ok: false,
            error: 'Already blocked',
        });
    });

    it('rejects a subdomain already covered by its parent', () => {
        expect(checkDuplicate('mail.example.com', ['example.com'])).toEqual({
            ok: false,
            error: 'Already covered by example.com',
        });
    });

    it('does not treat a similar-looking domain as a subdomain', () => {
        expect(checkDuplicate('notexample.com', ['example.com'])).toEqual({
            ok: true,
            error: ""
        });
    });
});
import type { FormEvent } from 'react';
import { Button, Icon, Input, Text } from '../Atoms';

type BlockSiteFormProps = {
    url: string;
    error: string;
    notice: string;
    onUrlChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BlockSiteForm({ url, error, notice, onUrlChange, onSubmit }: BlockSiteFormProps) {
    return (
        <>
            <form className="add-form" onSubmit={onSubmit}>
                <Input
                    aria-label="URL or domain to block"
                    autoComplete="url"
                    icon="link"
                    onChange={(event) => onUrlChange(event.currentTarget.value)}
                    placeholder="Enter URL or domain (e.g. twitch.tv)"
                    value={url}
                />
                <Button type="submit"><Icon name="check" size={18} />Block</Button>
            </form>
            {error && <Text variant="caption" className="form-message form-message--error" role="alert">{error}</Text>}
            {notice && !error && <Text variant="caption" className="form-message" role="status">{notice}</Text>}
        </>
    );
}
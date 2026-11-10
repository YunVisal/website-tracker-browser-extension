import { Badge, Text } from '@mantine/core';
import { LockKeyhole } from 'lucide-react';

export function LockIcon() {
    return (
        <span className="blocked-lock" aria-hidden="true">
            <LockKeyhole size={32} strokeWidth={2} />
        </span>
    );
}

export function SiteIndicator() {
    return <span className="blocked-site-indicator" aria-hidden="true" />;
}

type DomainLabelProps = {
    children: string;
};

export function DomainLabel({ children }: DomainLabelProps) {
    return <Text className="blocked-domain">{children}</Text>;
}

export function RestrictedTag() {
    return <Badge className="blocked-restricted-tag">restricted</Badge>;
}

type VersionLabelProps = {
    version: string;
};

export function VersionLabel({ version }: VersionLabelProps) {
    return <Text className="blocked-version">FocusShield v{version} Engine</Text>;
}
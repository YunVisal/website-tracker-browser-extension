import { Text } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { BrandMark, PrimaryAction, StatusBadge } from '../../popup/components/atoms';
import { DomainLabel, LockIcon, RestrictedTag, SiteIndicator } from './atoms';

export function BlockedPageHeader() {
    return (
        <header className="blocked-header">
            <BrandMark />
            <StatusBadge active>Active</StatusBadge>
        </header>
    );
}

type RestrictedSiteLabelProps = {
    site: string;
};

export function RestrictedSiteLabel({ site }: RestrictedSiteLabelProps) {
    return (
        <div className="restricted-site-label" aria-label={`${site}, restricted`}>
            <SiteIndicator />
            <DomainLabel>{site}</DomainLabel>
            <RestrictedTag />
        </div>
    );
}

type RestrictionMessageProps = {
    site: string;
};

export function RestrictionMessage({ site }: RestrictionMessageProps) {
    return (
        <section className="restriction-message" aria-labelledby="restriction-title">
            <LockIcon />
            <RestrictedSiteLabel site={site} />
            <Text id="restriction-title" component="h1" className="restriction-title">
                Access Restricted by FocusShield
            </Text>
            <Text className="restriction-copy">
                Stay intentional. You set this strict rule to preserve cognitive energy for your
                high-priority outcomes today.
            </Text>
        </section>
    );
}

type ReturnToSafeZoneActionProps = {
    onReturn: () => void;
};

export function ReturnToSafeZoneAction({ onReturn }: ReturnToSafeZoneActionProps) {
    return (
        <PrimaryAction onClick={onReturn}>
            <ArrowLeft size={16} aria-hidden="true" />
            Return to Safe Zone
        </PrimaryAction>
    );
}
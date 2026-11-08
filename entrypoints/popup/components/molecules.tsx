import { Group, Paper, Text } from '@mantine/core';
import { Clock3, Globe2, Pause, Plus, Search, Shield, Trash2 } from 'lucide-react';
import {
    AttemptCount,
    BrandMark,
    CountBadge,
    DomainInput,
    DomainName,
    FilterField,
    IconAction,
    PrimaryAction,
    ShieldToggle,
    SiteTile,
    StatusBadge,
} from './atoms';
import type { BlockedSite } from './types';

type DashboardHeaderProps = {
    shieldEnabled: boolean;
    onShieldChange: (enabled: boolean) => void;
};

export function DashboardHeader({ shieldEnabled, onShieldChange }: DashboardHeaderProps) {
    return (
        <header className="popup-header">
            <div>
                <Group gap="sm" align="center">
                    <BrandMark compact />
                    <Text className="popup-title">FocusShield</Text>
                    <StatusBadge active={shieldEnabled}>{shieldEnabled ? 'Active' : 'Paused'}</StatusBadge>
                </Group>
                <Text className="popup-subtitle">Shield Dashboard</Text>
            </div>
            <ShieldToggle checked={shieldEnabled} onChange={onShieldChange} />
        </header>
    );
}

type CurrentTabPanelProps = {
    shieldEnabled: boolean;
    domain: string;
    onBlock: () => void;
};

export function CurrentTabPanel({ shieldEnabled, domain, onBlock }: CurrentTabPanelProps) {
    return (
        <Paper className={`shield-panel${shieldEnabled ? ' shield-panel--active' : ' shield-panel--paused'}`}>
            <Group className="shield-panel__heading" justify="space-between">
                <Group gap="xs">
                    <span className="shield-panel__indicator" aria-hidden="true" />
                    <Text className="eyebrow">{shieldEnabled ? 'Shield active' : 'Shield paused'}</Text>
                </Group>
                <Shield size={16} aria-hidden="true" />
            </Group>
            <div className="current-site">
                <span className="current-site__icon"><Globe2 size={18} aria-hidden="true" /></span>
                <div className="current-site__copy">
                    <Text className="current-site__label">Current tab</Text>
                    <Text className="current-site__domain" title={domain || 'Unavailable'}>
                        {domain || 'No website detected'}
                    </Text>
                </div>
                <PrimaryAction tone="danger" disabled={!domain} onClick={onBlock}>
                    <Shield size={16} aria-hidden="true" />
                    Block tab
                </PrimaryAction>
            </div>
        </Paper>
    );
}

type DomainEntryFormProps = {
    value: string;
    error?: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
};

export function DomainEntryForm({ value, error, onValueChange, onSubmit }: DomainEntryFormProps) {
    return (
        <form
            className="domain-entry"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <DomainInput value={value} onChange={onValueChange} error={error} />
            <PrimaryAction>
                <Plus size={18} aria-hidden="true" />
                Block
            </PrimaryAction>
        </form>
    );
}

type BlockedSitesToolbarProps = {
    count: number;
    filter: string;
    onFilterChange: (filter: string) => void;
};

export function BlockedSitesToolbar({ count, filter, onFilterChange }: BlockedSitesToolbarProps) {
    return (
        <div className="sites-toolbar">
            <Group gap="xs" align="center">
                <Text id="blocked-sites-heading" component="h2" className="section-title">Blocked sites</Text>
                <CountBadge count={count} label="blocked sites" />
            </Group>
            <FilterField value={filter} onChange={onFilterChange} />
        </div>
    );
}

type BlockedSiteRowProps = {
    site: BlockedSite;
    onPauseToggle: (domain: string) => void;
    onFilter: (domain: string) => void;
    onRemove: (domain: string) => void;
};

export function BlockedSiteRow({ site, onPauseToggle, onFilter, onRemove }: BlockedSiteRowProps) {
    const { domain, paused, attempts } = site;

    return (
        <Paper className="site-row" role="listitem">
            <SiteTile domain={domain} />
            <div className="site-row__info">
                <DomainName>{domain}</DomainName>
                <AttemptCount count={attempts} />
            </div>
            <div className="site-row__actions">
                <IconAction
                    icon={paused ? <Clock3 size={17} /> : <Pause size={17} />}
                    label={paused ? `Resume ${domain}` : `Pause ${domain}`}
                    tone={paused ? 'warning' : 'default'}
                    onClick={() => onPauseToggle(domain)}
                />
                <IconAction
                    icon={<Search size={17} />}
                    label={`Filter by ${domain}`}
                    onClick={() => onFilter(domain)}
                />
                <IconAction
                    icon={<Trash2 size={17} />}
                    label={`Remove ${domain}`}
                    tone="danger"
                    onClick={() => onRemove(domain)}
                />
            </div>
        </Paper>
    );
}
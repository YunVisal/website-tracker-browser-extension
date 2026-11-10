import type { ReactNode } from 'react';
import {
    ActionIcon,
    Badge,
    Button,
    Switch,
    Text,
    TextInput,
} from '@mantine/core';
import { Link2, Search, ShieldCheck } from 'lucide-react';

type BrandMarkProps = {
    compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
    return (
        <span className={`brand-mark${compact ? ' brand-mark--compact' : ''}`}>
            <span className="brand-mark__icon" aria-hidden="true"><ShieldCheck size={18} /></span>
            {!compact && <Text className="brand-mark__name">FocusShield</Text>}
        </span>
    );
}

type StatusBadgeProps = {
    children: ReactNode;
    active?: boolean;
};

export function StatusBadge({ children, active = false }: StatusBadgeProps) {
    return (
        <Badge className={`status-badge${active ? ' status-badge--active' : ' status-badge--inactive'}`}>
            {active && <StatusDot />}
            {children}
        </Badge>
    );
}

export function StatusDot() {
    return <span className="status-dot" aria-hidden="true" />;
}

type CountBadgeProps = {
    count: number;
    label: string;
};

export function CountBadge({ count, label }: CountBadgeProps) {
    return (
        <Badge className="count-badge" aria-label={`${count} ${label}`}>
            {count}
        </Badge>
    );
}

type ShieldToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
};

export function ShieldToggle({ checked, onChange, label = 'Enable FocusShield' }: ShieldToggleProps) {
    return (
        <Switch
            className="shield-toggle"
            checked={checked}
            onChange={(event) => onChange(event.currentTarget.checked)}
            aria-label={label}
            size="md"
            color="emerald"
            thumbIcon={null}
        />
    );
}

type DomainFieldProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    error?: string;
    disabled?: boolean;
};

export function DomainInput({ value, onChange, error, disabled }: Omit<DomainFieldProps, 'onSubmit'>) {
    return (
        <TextInput
            className="domain-input"
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="Enter URL or domain"
            aria-label="Website URL or domain to block"
            leftSection={<Link2 size={16} aria-hidden="true" />}
            error={error}
            disabled={disabled}
            autoComplete="url"
        />
    );
}

type FilterFieldProps = {
    value: string;
    onChange: (value: string) => void;
};

export function FilterField({ value, onChange }: FilterFieldProps) {
    return (
        <TextInput
            className="filter-field"
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="Filter..."
            aria-label="Filter blocked sites"
            leftSection={<Search size={16} aria-hidden="true" />}
        />
    );
}

type SiteTileProps = {
    domain: string;
};

export function SiteTile({ domain }: SiteTileProps) {
    const label = domain
        .replace(/^www\./, '')
        .split('.')[0]
        ?.slice(0, 2)
        .toUpperCase() ?? '??';

    return (
        <span className="site-tile" aria-hidden="true">
            {label}
        </span>
    );
}

type DomainNameProps = {
    children: ReactNode;
};

export function DomainName({ children }: DomainNameProps) {
    return <Text className="domain-name">{children}</Text>;
}

type PrimaryActionProps = {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
    color?: string;
    tone?: 'primary' | 'danger';
};

export function PrimaryAction({ children, onClick, disabled, type = 'button', color = 'emerald', tone = 'primary' }: PrimaryActionProps) {
    return (
        <Button type={type} className={`primary-action primary-action--${tone}`} color={color} onClick={onClick} disabled={disabled}>
            {children}
        </Button>
    );
}

type IconActionProps = {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    tone?: 'default' | 'warning' | 'danger';
};

export function IconAction({ icon, label, onClick, tone = 'default' }: IconActionProps) {
    return (
        <ActionIcon
            className={`icon-action icon-action--${tone}`}
            variant="subtle"
            aria-label={label}
            title={label}
            onClick={onClick}
        >
            {icon}
        </ActionIcon>
    );
}
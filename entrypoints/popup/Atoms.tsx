import type { ButtonHTMLAttributes, ElementType, InputHTMLAttributes, ReactNode } from 'react';
import {
    Check,
    Clock3,
    Globe2,
    Link2,
    Search,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    Trash2,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export type IconName = 'shield' | 'bolt' | 'globe' | 'link' | 'search' | 'check' | 'clock' | 'sliders' | 'trash';

const iconMap: Record<IconName, LucideIcon> = {
    shield: Shield,
    bolt: Zap,
    globe: Globe2,
    link: Link2,
    search: Search,
    check: Check,
    clock: Clock3,
    sliders: SlidersHorizontal,
    trash: Trash2,
};

export function Icon({ name, size = 18, strokeWidth = 2 }: { name: IconName; size?: number; strokeWidth?: number }) {
    const IconComponent = iconMap[name];
    return <IconComponent aria-hidden="true" size={size} strokeWidth={strokeWidth} />;
}

export function Text({
    as: Component = 'span',
    variant = 'body',
    className = '',
    children,
    id,
    role,
}: {
    as?: ElementType;
    variant?: 'heading' | 'body' | 'caption' | 'muted' | 'mono';
    className?: string;
    children: ReactNode;
    id?: string;
    role?: string;
}) {
    return <Component className={`text text--${variant} ${className}`.trim()} id={id} role={role}>{children}</Component>;
}

export function Button({
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'icon-only' }) {
    return (
        <button className={`button button--${variant} ${className}`.trim()} {...props}>
            {children}
        </button>
    );
}

export function Input({ icon, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { icon?: IconName }) {
    return (
        <span className={`input-shell ${className}`.trim()}>
            {icon && <Icon name={icon} size={19} />}
            <input className="input" {...props} />
        </span>
    );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button
            aria-checked={checked}
            aria-label={label}
            className={`toggle ${checked ? 'toggle--checked' : ''}`}
            onClick={onChange}
            role="switch"
            type="button"
        >
            <span className="toggle__thumb" />
        </button>
    );
}

export function Badge({
    variant = 'category',
    children,
}: {
    variant?: 'status' | 'count' | 'category';
    children: ReactNode;
}) {
    return <span className={`badge badge--${variant}`}>{children}</span>;
}

export function Chip({
    selected,
    children,
    onClick,
}: {
    selected: boolean;
    children: ReactNode;
    onClick: () => void;
}) {
    return (
        <button className={`chip ${selected ? 'chip--selected' : ''}`} onClick={onClick} type="button">
            {selected && <Icon name="check" size={15} />}
            {children}
        </button>
    );
}

export function Avatar({ initials, tone }: { initials: string; tone: 'mint' | 'rose' | 'blue' | 'gold' }) {
    return <span className={`avatar avatar--${tone}`} aria-hidden="true">{initials}</span>;
}

export function StatusDot({ color = 'mint' }: { color?: 'mint' | 'rose' }) {
    return <span aria-hidden="true" className={`status-dot status-dot--${color}`} />;
}

export function Logo({ size = 'medium' }: { size?: 'small' | 'medium' }) {
    return (
        <span className={`logo logo--${size}`} aria-hidden="true">
            <ShieldCheck />
            <span className="logo__spark" />
        </span>
    );
}
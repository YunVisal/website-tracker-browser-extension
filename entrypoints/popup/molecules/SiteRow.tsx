import { Avatar, Badge, Button, Icon, Text } from '../Atoms';
import type { Site, SiteRowAction } from './types';

const rowActions: { icon: 'clock' | 'sliders' | 'trash'; label: SiteRowAction }[] = [
    { icon: 'clock', label: 'View activity' },
    { icon: 'sliders', label: 'Pause or resume blocking' },
    { icon: 'trash', label: 'Remove site' },
];

export function SiteRow({ site, activityOpen, onAction }: {
    site: Site;
    activityOpen: boolean;
    onAction: (action: SiteRowAction, site: Site) => void;
}) {
    return (
        <article className={`site-row ${site.paused ? 'site-row--paused' : ''}`}>
            <Avatar initials={site.initials} tone={site.tone} />
            <div className="site-details">
                <div className="site-title-line">
                    <Text variant="mono" className="site-domain">{site.domain}</Text>
                    <Badge>{site.category}</Badge>
                </div>
                <Text variant="muted" className="site-attempts">
                    {site.paused ? 'Blocking paused' : `${site.attempts} attempts intercepted`}
                </Text>
                {activityOpen && (
                    <Text variant="caption" className="activity-note">Today · {site.attempts} blocked visits</Text>
                )}
            </div>
            <div className="row-actions">
                {rowActions.map(({ icon, label }) => (
                    <Button
                        aria-label={`${label}: ${site.domain}`}
                        className={icon === 'sliders' && site.paused ? 'row-action--active' : ''}
                        key={icon}
                        onClick={() => onAction(label, site)}
                        title={`${label} · ${site.domain}`}
                        variant="icon-only"
                    >
                        <Icon name={icon} size={20} />
                    </Button>
                ))}
            </div>
        </article>
    );
}
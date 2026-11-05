import { Icon, StatusDot, Text } from '../Atoms';

export function ShieldSummary({ active }: { active: boolean }) {
    return (
        <div className="shield-summary">
            <div className="shield-label">
                <StatusDot color={active ? 'mint' : 'rose'} />
                <Text variant="caption">{active ? 'SHIELD ACTIVE' : 'SHIELD PAUSED'}</Text>
            </div>
            <div className="saved-summary">
                <Icon name="bolt" size={17} />
                <Text variant="mono">42 blocks · 2h 15m saved</Text>
            </div>
        </div>
    );
}
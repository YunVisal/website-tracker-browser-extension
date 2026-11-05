import { Badge, Logo, StatusDot, Text, Toggle } from '../Atoms';

export function BrandHeader({ shieldActive, onToggle }: { shieldActive: boolean; onToggle: () => void }) {
    return (
        <header className="topbar">
            <div className="brand-lockup">
                <Logo />
                <div className="brand-copy">
                    <div className="brand-title-line">
                        <Text as="h1" variant="heading">FocusShield</Text>
                        <Badge variant="status"><StatusDot />{shieldActive ? 'Active' : 'Paused'}</Badge>
                    </div>
                    <Text variant="muted">Shield Dashboard</Text>
                </div>
            </div>
            <Toggle checked={shieldActive} onChange={onToggle} label="Turn shield on or off" />
        </header>
    );
}
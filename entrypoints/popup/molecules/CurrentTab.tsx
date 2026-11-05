import { Button, Icon, Text } from '../Atoms';

export function CurrentTab({ onBlock }: { onBlock: () => void }) {
    return (
        <div className="current-tab">
            <div className="current-site">
                <span className="current-site__icon"><Icon name="globe" size={19} /></span>
                <div>
                    <Text variant="caption">Current Tab</Text>
                    <Text variant="mono" className="current-domain">reddit.com/r/popular</Text>
                </div>
            </div>
            <Button variant="danger" onClick={onBlock}><Icon name="shield" size={18} />Block Tab</Button>
        </div>
    );
}
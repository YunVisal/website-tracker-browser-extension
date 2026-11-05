import { Badge, Input, Text } from '../Atoms';

export function SiteListHeader({ count, filter, onFilterChange }: {
    count: number;
    filter: string;
    onFilterChange: (value: string) => void;
}) {
    return (
        <div className="section-heading">
            <div className="heading-count">
                <Text as="h2" variant="heading" className="section-title" id="sites-heading">Blocked Sites</Text>
                <Badge variant="count">{count}</Badge>
            </div>
            <Input
                aria-label="Filter blocked sites"
                icon="search"
                onChange={(event) => onFilterChange(event.currentTarget.value)}
                placeholder="Filter..."
                value={filter}
            />
        </div>
    );
}
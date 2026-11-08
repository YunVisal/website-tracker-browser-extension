import { Box, ScrollArea, Stack, Text } from '@mantine/core';
import { BlockedSiteRow } from '../molecules';
import type { BlockedSite } from '../types';

type BlockedSitesListProps = {
    sites: BlockedSite[];
    filter: string;
    onPauseToggle: (domain: string) => void;
    onFilter: (domain: string) => void;
    onRemove: (domain: string) => void;
};

export function BlockedSitesList({
    sites,
    filter,
    onPauseToggle,
    onFilter,
    onRemove,
}: BlockedSitesListProps) {
    return (
        <ScrollArea
            className="sites-scroll"
            viewportProps={{ className: 'sites-scroll__viewport' }}
            type="auto"
            scrollbars="y"
            offsetScrollbars="y"
        >
            <Stack className="site-list" gap="xs" role="list">
                {sites.length ? sites.map((site) => (
                    <BlockedSiteRow
                        key={site.domain}
                        site={site}
                        onPauseToggle={onPauseToggle}
                        onFilter={onFilter}
                        onRemove={onRemove}
                    />
                )) : (
                    <Box className="empty-state" role="listitem">
                        <Text>{filter ? 'No matching websites' : 'No websites blocked yet'}</Text>
                        <Text className="empty-state__hint">
                            {filter ? 'Try another domain.' : 'Add a domain above to build your block list.'}
                        </Text>
                    </Box>
                )}
            </Stack>
        </ScrollArea>
    );
}
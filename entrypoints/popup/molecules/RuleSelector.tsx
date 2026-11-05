import { Chip } from '../Atoms';
import type { RuleMode } from './types';

export function RuleSelector({ mode, onChange }: { mode: RuleMode; onChange: (mode: RuleMode) => void }) {
    return (
        <div className="rule-chips" aria-label="Blocking rule">
            <Chip selected={mode === 'exact'} onClick={() => onChange('exact')}>Exact Domain</Chip>
            <Chip selected={mode === 'wildcard'} onClick={() => onChange('wildcard')}>Wildcard (*.domain)</Chip>
            <Chip selected={mode === 'strict'} onClick={() => onChange('strict')}>Strict Redirect</Chip>
        </div>
    );
}
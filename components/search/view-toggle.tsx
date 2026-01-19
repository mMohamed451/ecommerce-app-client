'use client';

import { Button } from '@/components/ui/button';
import { Grid3x3, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

export function ViewToggle({ viewMode, onChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-2 border rounded-lg p-1 ${className}`}>
      <Button
        type="button"
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('grid')}
        className="px-3"
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('list')}
        className="px-3"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}

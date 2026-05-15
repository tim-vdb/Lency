"use client";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/front/components/ui/input-group';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function SearchBar() {
    const [search, setSearch] = useState('');

    return (
        <InputGroup className="border border-neutral-500 max-w-sm rounded-sm">
            <InputGroupInput
                placeholder="Search..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    );
}

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'
import React from 'react'

export default function SearchBar({ search, setSearch, filteredData }: { search: string, setSearch: (value: string) => void, filteredData: any[] }) {
    return (
        <>
            <InputGroup className='max-w-sm'>
                <InputGroupInput
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
                </InputGroupAddon>
            </InputGroup>
        </>
    )
}

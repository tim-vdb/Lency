'use client';

import { Card } from '@/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { BlogCard } from '@/features/Blog/GetBlog/components/BlogCard';
import { Blog, User } from '@/generated/prisma_client';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';

interface FilterProps {
  blogs: (Blog & { author: User })[];
  isAdmin: boolean;
}

export default function Filter({ blogs, isAdmin }: FilterProps) {
  const [search, setSearch] = useState('');
  const [publishedStatus, setPublishedStatus] = useState<
    'all' | 'published' | 'unpublished'
  >('all');

  // Filtrer les blogs par recherche ET statut de publication
  const filteredData = useMemo(() => {
    return blogs.filter((blog) => {
      // Filtre par recherche (titre)
      const matchesSearch =
        search === '' ||
        blog.title.toLowerCase().includes(search.toLowerCase());

      // Filtre par statut de publication
      let matchesPublished = true;
      if (publishedStatus === 'published') {
        matchesPublished = blog.published === true;
      } else if (publishedStatus === 'unpublished') {
        matchesPublished = blog.published === false;
      }
      // Si "all", matchesPublished reste true

      return matchesSearch && matchesPublished;
    });
  }, [blogs, search, publishedStatus]);

  return (
    <div className="flex flex-col gap-4 items-start">
      <Item variant="muted" className="flex flex-col gap-4 w-full items-start">
        <SearchBar
          search={search}
          setSearch={setSearch}
          filteredData={filteredData}
        />

        <Item className="flex">
          <Select autoComplete="off">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="category1">Category 1</SelectItem>
              <SelectItem value="category2">Category 2</SelectItem>
              <SelectItem value="category3">Category 3</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Item variant={'outline'} className="w-full">
              <ItemContent>
                <RadioGroup
                  value={publishedStatus}
                  onValueChange={(value) =>
                    setPublishedStatus(
                      value as 'all' | 'published' | 'unpublished'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="all" id="r1" />
                    <Label htmlFor="r1">All</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="published" id="r2" />
                    <Label htmlFor="r2">Published</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="unpublished" id="r3" />
                    <Label htmlFor="r3">Unpublished</Label>
                  </div>
                </RadioGroup>
              </ItemContent>
            </Item>
          )}
        </Item>
      </Item>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-20 w-full">
        {filteredData.map((blog) => (
          <div key={blog.id} className="container">
            <BlogCard blog={blog} isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    </div>
  );
}

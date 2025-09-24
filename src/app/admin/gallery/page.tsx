import Gallery from '@/features/Gallery/components/Gallery'
import { GetImages } from '@/features/Gallery/gallery.action';
import React from 'react'

export default async function page() {
    const images = await GetImages();

    return (
        <section className="mx-10 my-5 p-8 shadow-md rounded-xl">
            <h2>Galeries d'Images</h2>
            <Gallery images={images} />
        </section>
    )
}

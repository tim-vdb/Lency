import { Button } from "@/front/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from 'swiper/modules';

export default function CategoriesBar() {
    const dataCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 4, name: 'Category 4' },
        { id: 5, name: 'Category 5' },
        { id: 6, name: 'Category 6' },
        { id: 7, name: 'Category 7' },
        { id: 8, name: 'Category 8' },
        { id: 9, name: 'Category 9' },
        { id: 10, name: 'Category 10' },
        { id: 11, name: 'Category 11' },
        { id: 12, name: 'Category 12' },
        { id: 13, name: 'Category 13' },
        { id: 14, name: 'Category 14' },
        { id: 15, name: 'Category 15' },
        { id: 16, name: 'Category 16' },
        { id: 17, name: 'Category 17' },
        { id: 18, name: 'Category 18' },
        { id: 19, name: 'Category 19' },
        { id: 20, name: 'Category 20' },
        { id: 21, name: 'Category 21' },
        { id: 22, name: 'Category 22' },
        { id: 23, name: 'Category 23' },
        { id: 24, name: 'Category 24' },
        { id: 25, name: 'Category 25' },
        { id: 26, name: 'Category 26' },
        { id: 27, name: 'Category 27' },
        { id: 28, name: 'Category 28' },
        { id: 29, name: 'Category 29' },
        { id: 30, name: 'Category 30' },
    ]

    // Séparer les catégories en deux rangées (pair/impair)
    const topRowCategories = dataCategories.filter((_, index) => index % 2 === 0);
    const bottomRowCategories = dataCategories.filter((_, index) => index % 2 !== 0);

    return (
        <div className="relative w-full px-20">
            {/* Shadow gauche */}
            <div className="absolute left-20 top-0 bottom-0 w-8 bg-linear-to-r from-white via-white/10 to-transparent z-10 pointer-events-none" />

            {/* Shadow droite */}
            <div className="absolute right-20 top-0 bottom-0 w-8 bg-linear-to-l from-white via-white/10 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-2 relative">
                <Swiper
                    modules={[FreeMode, Mousewheel]}
                    slidesPerView="auto"
                    spaceBetween={12}
                    grabCursor
                    freeMode={{
                        enabled: true,
                        sticky: false,
                        momentum: true,
                        momentumBounce: false,
                        momentumRatio: 0.5,
                        momentumVelocityRatio: 0.3,
                    }}
                    mousewheel={{
                        enabled: true,
                        forceToAxis: true,
                        sensitivity: 1,
                    }}
                    resistance={true}
                    resistanceRatio={0.85}
                    speed={300}
                    threshold={5}
                    className="flex-1"
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                    }}
                >
                    <SwiperSlide style={{ width: 'auto' }}>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                {/* Espace vide en haut à gauche */}
                                <div className="px-6 py-1 h-auto" />
                                {topRowCategories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant="outline"
                                        size="sm"
                                        className="border bg-neutral-150 hover:bg-neutral-300 cursor-pointer text-[11px] px-3 py-1 h-auto shrink-0 whitespace-nowrap border-none"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                {bottomRowCategories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant="outline"
                                        size="sm"
                                        className="border bg-neutral-150 hover:bg-neutral-300 cursor-pointer text-[11px] px-3 py-1 h-auto shrink-0 whitespace-nowrap border-none"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                                {/* Espace vide en bas à droite */}
                                <div className="px-6 py-1 h-auto" />
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div >
    );
}
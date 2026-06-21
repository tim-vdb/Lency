import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

export function CarouselSection({ label, href, children, count }: {
    label: string;
    href?: string;
    children: React.ReactNode;
    count: number;
}) {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(count <= 3);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                {href ? (
                    <Link href={href} className="group flex items-center gap-1 font-['Poppins',sans-serif] font-bold text-[20px] leading-7 text-black hover:text-orange transition-colors">
                        {label}
                        <ChevronRight className="w-5 h-5 text-black group-hover:text-orange transition-colors" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-1">
                        <span className="font-['Poppins',sans-serif] font-bold text-[20px] leading-7 text-black">{label}</span>
                        <ChevronRight className="w-5 h-5 text-black" />
                    </div>
                )}
                <div className="flex gap-2">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        disabled={isBeginning}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-light bg-white hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronLeft className="w-4 h-4 text-black" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        disabled={isEnd}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-light bg-white hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>
            <Swiper
                onSwiper={(s) => { swiperRef.current = s; setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
                onSlideChange={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.2}
                breakpoints={{ 640: { slidesPerView: 2.1 }, 1024: { slidesPerView: 3.05 } }}
                className="w-full overflow-visible!"
            >
                {children}
            </Swiper>
        </div>
    );
}

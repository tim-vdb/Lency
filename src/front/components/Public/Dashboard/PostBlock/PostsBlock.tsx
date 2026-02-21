'use client';

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../ui/card";

import 'swiper/css';
import CategoriesBar from "./CategoriesBar";

export default function PostsBlock() {

    return (
        <Card className="col-[1/7] row-[1/5] shadow-lg-inset px-6 gap-6 ">
            <CardHeader className="flex items-center flex-col px-0">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className='flex flex-wrap'>Posts</CardTitle>
                    <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <CategoriesBar />
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-20 h-full rounded-sm px-0">
                <Card className="justify-end col-start-1 col-end-4 gap-4 shadow-none py-0">
                    <CardHeader className="flex items-center justify-between px-0">
                        <CardTitle className="text-md">Communautés</CardTitle>
                        <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer">Voir plus</Button>
                    </CardHeader>
                    <CardContent className="px-0 mb-2">
                        <Card className="border p-3 gap-4 shadow-lg-base">
                            <CardHeader className="flex items-center gap-1 px-0">
                                <Image src="/images/team/avatar/Photo_Pro_avecOutline.png" alt="Avatar" width={50} height={50} className="w-8 h-8 rounded-full mr-2" />
                                <CardTitle className="text-sm">John Doe</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 min-h-10">
                                <p className="text-sm text-neutral-500 line-clamp-2 max-w-64">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe voluptate, eligendi rem error quisquam obcaecati tempore blanditiis repudiandae a itaque cupiditate, labore iure ipsa delectus porro reprehenderit doloremque voluptatum aperiam?</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between px-0">
                                <div>
                                    {/* TODO: fetch data for tags */}
                                    {[1, 2, 3].map((_, index) => (
                                        <span key={index} className="text-xs text-neutral-500 mr-2">#tag</span>
                                    ))}
                                </div>
                                <Button variant="secondary" size="sm" className="border bg-neutral-300 cursor-pointer">View</Button>
                            </CardFooter>
                        </Card>
                    </CardContent>
                </Card>
                <Card className="justify-end col-start-4 col-end-6 gap-4 shadow-none py-0">
                    <CardHeader className="flex items-center justify-between px-0">
                        <CardTitle className="text-md">Populaire</CardTitle>
                        <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer">View All</Button>
                    </CardHeader>
                    <CardContent className="px-0 mb-2">
                        <Card className="border p-3 gap-4 shadow-lg-base">
                            <CardHeader className="flex items-center gap-1 px-0">
                                <Image src="/images/team/avatar/Photo_Pro_avecOutline.png" alt="Avatar" width={50} height={50} className="w-8 h-8 rounded-full mr-2" />
                                <CardTitle className="text-sm">John Doe</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 min-h-10">
                                <p className="text-sm text-neutral-500 line-clamp-2 max-w-64">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe voluptate, eligendi rem error quisquam obcaecati tempore blanditiis repudiandae a itaque cupiditate, labore iure ipsa delectus porro reprehenderit doloremque voluptatum aperiam?</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between px-0">
                                <div>
                                    {[1, 2, 3].map((_, index) => (
                                        <span key={index} className="text-xs text-neutral-500 mr-2">#tag</span>
                                    ))}
                                </div>
                                <Button variant="secondary" size="sm" className="border bg-neutral-300 cursor-pointer">View</Button>
                            </CardFooter>
                        </Card>
                    </CardContent>
                </Card>
            </CardContent>
        </Card >
    );
}
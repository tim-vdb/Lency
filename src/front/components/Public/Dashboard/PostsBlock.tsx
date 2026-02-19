import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function PostsBlock() {
    return (
        <Card className="col-[1/5] row-[1/5] shadow-lg-base px-5 py-5">
            <Card className="flex flex-col justify-between bg-neutral-50 shadow-none border max-h-26 py-2 px-3 gap-2 pb-4">
                <CardHeader className="flex items-center px-0">
                    <CardTitle className='flex flex-wrap'>Posts</CardTitle>
                    <Button className="ml-auto">Add Post</Button>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2 rounded-sm px-1 py-2">
                    <ChevronLeft className="w-4 h-4" />
                    <div className="flex items-center gap-2 overflow-x-scroll scrollbar-hide">
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                        <Button variant="outline" className="w-full max-w-20 max-h-7">Viewers</Button>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                </CardContent>
            </Card>
            <div className="grid grid-cols-5 gap-5 h-full">
                <Card className="col-start-1 col-end-4 border">
                    <CardHeader>
                        <CardTitle className="text-sm">No posts yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-neutral-500">You have no posts yet.</p>
                    </CardContent>
                </Card>
                <Card className="col-start-4 col-end-6 border">
                    <CardHeader>
                        <CardTitle className="text-sm">No posts yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-neutral-500">You have no posts yet.</p>
                    </CardContent>
                </Card>
            </div>
        </Card>
    );
}
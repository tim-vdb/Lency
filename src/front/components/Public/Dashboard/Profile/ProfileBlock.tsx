import { Avatar } from "@/front/components/ui/avatar";
import { Card, CardContent } from "@/front/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function ProfileBlock() {
    return (
        <Card className="justify-center col-[7/9] row-[1/2] max-h-24 shadow-lg-base py-0">
            <CardContent className="flex items-center justify-between gap-4">
                <Card className="flex flex-row items-center px-3 py-2 border border-neutral-400 bg-neutral-100 cursor-pointer">
                    <span className="text-lg">Badges</span>
                    <Avatar>
                        <AvatarImage
                            src="/images/team/pro/Alyssia_HUSS.jpg"
                            alt="@shadcn"
                        />
                        <AvatarFallback>T-VDB</AvatarFallback>
                    </Avatar>
                </Card>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="font-semibold truncate max-w-34">T. Van Den Bosch</span>
                        <span className="text-xs text-neutral-400">Développeur</span>
                    </div>

                    <Avatar>
                        <AvatarImage
                            src="/images/team/avatar/Photo_Pro_avecOutline.png"
                            alt="@shadcn"
                        />
                        <AvatarFallback>T-VDB</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </Card>
    );
}
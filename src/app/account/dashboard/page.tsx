import ExploreBlock from '@/front/components/Public/Dashboard/Explore/ExploreBlock'
import MarketplaceBlock from '@/front/components/Public/Dashboard/Marketplace/MarketplaceBlock'
import PostsBlock from '@/front/components/Public/Dashboard/Posts/PostsBlock'
// import ProfileBlock from '@/front/components/Public/Dashboard/Profile/ProfileBlock'
import {
    Card
} from '@/front/components/ui/card'

import { AppSidebar } from "@/front/components/Public/Dashboard/Sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/front/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/front/components/ui/sidebar";
import { Separator } from "@/front/components/ui/separator";
import { NavUser } from '@/front/components/Public/Dashboard/Sidebar/nav-user'
import { AppSidebarRight } from '@/front/components/Public/Dashboard/Sidebar/app-sidebar-right';

// export default function Dashboard() {
//     return (
//         // bg-neutral-150
//         
//     )
// }

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
}


export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between gap-2 px-4 w-full">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Build Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <NavUser user={data.user} />
                    </div>
                </header>
                {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                        <div className="bg-muted/50 aspect-video rounded-xl" />
                    </div>
                    <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
                </div> */}
                <div className='grid grid-cols-8 grid-rows-8 gap-6 p-4 h-[calc(100vh-4rem)] bg-[#FCF5EA]'>
                    <PostsBlock />
                    <MarketplaceBlock />
                    <ExploreBlock />
                    {/* <ProfileBlock /> */}
                    <Card className="col-[7/9] row-[1/7]"></Card>
                    <Card className="col-[7/9] row-[7/9]"></Card>
                </div>
            </SidebarInset>
            <AppSidebarRight />
        </SidebarProvider>
    )
}


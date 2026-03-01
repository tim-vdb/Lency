import EventsBlock from "@/front/components/Private/Account/Dashboard/Events/EventsBlock";
import ExploreBlock from "@/front/components/Private/Account/Dashboard/Explore/ExploreBlock";
import MarketplaceBlock from "@/front/components/Private/Account/Dashboard/Marketplace/MarketplaceBlock";
import PostsBlock from "@/front/components/Private/Account/Dashboard/Posts/PostsBlock";

export default function DashboardAccount() {
    return (
        <div className='grid grid-cols-7 grid-rows-2 gap-6 p-4 h-[calc(100vh-4rem)] bg-[#FCF5EA]'>
            <PostsBlock className="col-span-5" />
            <MarketplaceBlock className="col-span-5 row-start-2" />
            <ExploreBlock className="col-span-2" />
            <EventsBlock className="col-span-2" />
        </div>
    )
}
import ExploreBlock from "@/front/components/Private/Account/Dashboard/Explore/ExploreBlock";
import MarketplaceBlock from "@/front/components/Private/Account/Dashboard/Marketplace/MarketplaceBlock";
import CommunityBlock from "@/front/components/Private/Account/Dashboard/Community/CommunityBlock";

export default function DashboardAccount() {
    return (
        <div className='grid grid-cols-7 grid-rows-2 gap-4 h-[calc(100vh-6.5rem)] mt-4'>
            <CommunityBlock />
            <MarketplaceBlock className="col-span-5 row-start-2 px-3 gap-2 py-3 2xl:py-6 2xl:px-6 2xl:gap-6" />
            <ExploreBlock className="col-span-2 row-span-2 gap-4 py-3 2xl:gap-6" />
        </div>
    )
}
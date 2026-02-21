import MarketplaceBlock from '@/front/components/Public/Dashboard/Marketplace/MarketplaceBlock'
import PostsBlock from '@/front/components/Public/Dashboard/Posts/PostsBlock'
import {
    Card
} from '@/front/components/ui/card'

export default function Dashboard() {
    return (
        // bg-neutral-150
        <div className='grid grid-cols-8 grid-rows-8 gap-6 p-4 h-screen bg-[#FCF5EA]'>
            <PostsBlock />
            <MarketplaceBlock />
            <Card className="col-[5/7] row-[5/9] "></Card>
            <Card className="col-[7/9] row-[1/2] shadow-lg-base"></Card>
            <Card className="col-[7/9] row-[2/7]"></Card>
            <Card className="col-[7/9] row-[7/9]"></Card>
        </div>
    )
}

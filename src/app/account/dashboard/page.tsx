import PostsBlock from '@/front/components/Public/Dashboard/PostsBlock'
import {
    Card
} from '@/front/components/ui/card'

export default function Dashboard() {
    return (
        <div className='grid grid-cols-5 grid-rows-8 gap-10 p-6 h-screen bg-neutral-150'>
            <PostsBlock />
            <Card className="col-[1/3] row-[5/9] py-0 shadow-xl-inset"></Card>
            <Card className="col-[3/5] row-[5/9] "></Card>
            <Card className="col-[5/6] row-[1/2] shadow-lg-base"></Card>
            <Card className="col-[5/6] row-[2/7]"></Card>
            <Card className="col-[5/6] row-[7/9]"></Card>
        </div>
    )
}

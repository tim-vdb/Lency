import { Card } from '@/front/components/ui/card'
import React from 'react'

export default function Dashboard() {
    return (
        <div className='grid grid-cols-5 grid-rows-8 gap-5 p-6 h-screen'>
<Card className="col-[1/5] row-[1/5]"></Card>
<Card className="col-[1/3] row-[5/9]"></Card>
<Card className="col-[3/5] row-[5/9]"></Card>
<Card className="col-[5/6] row-[1/2]"></Card>
<Card className="col-[5/6] row-[2/7]"></Card>
<Card className="col-[5/6] row-[7/9]"></Card>
        </div>
    )
}

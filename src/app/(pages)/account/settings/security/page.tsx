"use client"

import SecurityA2F from "@/front/components/Private/Account/Security/SecurityA2F"
import SecurityPassword from "@/front/components/Private/Account/Security/SecurityPassword"
import SecuritySession from "@/front/components/Private/Account/Security/SecuritySession"

export default function SecuritySection() {
    return (
        <div className="flex flex-col gap-2">
            <SecurityPassword />
            <SecurityA2F />
            <SecuritySession />
        </div>
    )
}

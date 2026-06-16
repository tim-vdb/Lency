import SecurityPassword from "@/front/components/Private/Account/Security/SecurityPassword"
import SecuritySession from "@/front/components/Private/Account/Security/SecuritySession"

export default function SecurityPage() {
    return (
        <div className="flex flex-col gap-6">
            <SecurityPassword />
            <SecuritySession />
        </div>
    )
}

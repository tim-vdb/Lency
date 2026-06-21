import SecurityPassword from "@/front/components/Private/Account/Security/SecurityPassword"
import ProfileDelete from "@/front/components/Private/Account/Profile/ProfileDelete"

export default function SecurityPage() {
    return (
        <div className="flex flex-col gap-6">
            <SecurityPassword />
            <ProfileDelete />
        </div>
    )
}

import NotifsEmails from "@/front/components/Private/Account/Notifs/NotifsEmails"
import NotifsPreference from "@/front/components/Private/Account/Notifs/NotifsPreference"
import NotifsPush from "@/front/components/Private/Account/Notifs/NotifsPush"

export default function NotifsPage() {
    return (
        <div className="flex flex-col gap-6">
            <NotifsEmails />
            <NotifsPush />
            <NotifsPreference />
        </div>
    )
}

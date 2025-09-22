

import { Button } from "@/components/ui/button";
import { LogoutAction } from "../logout.action";

export default function LogOut() {
    return (
        <form action={LogoutAction}>
            <button className="cursor-pointer">
                Se déconnecter
            </button>
        </form>
    )
}
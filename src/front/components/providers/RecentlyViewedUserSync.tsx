"use client";

import { useEffect } from "react";
import { useUser } from "@/front/states/contexts/user.context";
import { setRecentlyViewedUser } from "@/front/states/stores/recently-viewed.store";

export function RecentlyViewedUserSync() {
    const user = useUser();

    useEffect(() => {
        setRecentlyViewedUser(user?.id ?? null);
    }, [user?.id]);

    return null;
}

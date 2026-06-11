import dynamic from "next/dynamic";
import type { Talent } from "@/front/lib/api/talents";

const TalentsMapInner = dynamic(
    () => import("./TalentsMapInner").then((m) => m.TalentsMapInner),
    { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted rounded-lg" /> }
);

export function TalentsMap({ talents }: { talents: Talent[] }) {
    return <TalentsMapInner talents={talents} />;
}

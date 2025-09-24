import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[url(/molkky.jpg)] overflow-hidden bg-center bg-cover h-full">
      <article className="w-full h-[100vh] flex flex-col items-start pt-65 px-15">
        <h1 className="z-99 text-white pb-10">Club Rhodanien de Mölkky</h1>
        <p className="z-99 text-white px-3">
          The Rhodanian Mölkky Club (CRHOM) is a Lyon-based association
          dedicated to discovering, practicing, and promoting the famous Finnish
          skittle game. Open to everyone, the club organizes introductions, fun
          events, and tournaments in a friendly atmosphere—whether during
          festive gatherings, casual meetups, or competitions.
        </p>
        <Button className="z-99 mt-20 bg-[#ffffff] text-black">
          <Link href="/login">Join The CRHOM</Link>
        </Button>
      </article>
    </div>
  );
}

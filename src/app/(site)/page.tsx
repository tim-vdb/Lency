import { Button } from "@/components/ui/button";
import EventCarousel from "@/features/Events/GetEvents/components/EventCarousel";
import Gallery from "@/features/Gallery/components/Gallery";
import { GetEvents } from "@/features/Events/GetEvents/events.action";
import Link from "next/link";
import { GetImages } from "@/features/Gallery/gallery.action";

export default async function Home() {
  const events = await GetEvents();
  const images = await GetImages();

  return (
    <article>
      <section className="bg-[url(/images/molkky.jpg)] overflow-hidden bg-center bg-cover h-[75vh] flex flex-col items-start pt-15 md:pt-25 px-15">
        <h1 className=" text-white pb-10">Club Rhodanien de Mölkky</h1>
        <p className="text-white px-3">
          Le Club Rhodanien de Mölkky (CRHOM) est une association Lyonnaise
          dédié à la découverte, la pratique et la promotion du célèbre jeu de
          quille. Ouvert à tous, le club organises des événements de
          découvertes, de jeu amicaux et des compétitions dans une atmosphère
          familiale ainsi que des festivales pour se rencontrer en toute
          simplicité.
        </p>
        <Button className=" mt-20 bg-[#ffffff] text-black">
          <Link href="/login" className=" text-black text-base">
            Rejoins le CRHOM
          </Link>
        </Button>
      </section>
      <article className="container">
        {events && events.length > 0 && (
          <section className="mx-10 my-5 px-20 py-8 shadow-md rounded-xl">
            <h2>Les Derniers événements</h2>
            <div className="w-full flex flex-col flex-wrap md:flex-nowrap justify-center items-center gap-15">
              <EventCarousel />
              <Button className=" bg-[var(--color-gold)] text-black">
                <Link href="/events">Voir plus d'événements</Link>
              </Button>
            </div>
          </section>
        )}
        <section className="mx-10 my-5 p-8 shadow-md rounded-xl">
          <h2>Galeries d'Images</h2>
          <Gallery images={images} />
        </section>
      </article>
    </article>
  );
}

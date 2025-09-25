import Image from "next/image";

export default function Page() {
  return (
    <article className="container w-[100vw] my-10 flex flex-col items-center md:gap-10 ">
      <div className=" bg-[url(/images/chrom-team.jpeg)] overflow-hidden bg-center bg-cover h-[50vh] w-[70%] rounded-md">
        <h1 className="my-4 text-white">Club Rhodanien de Mölkky</h1>
      </div>
      <section className="flex flex-wrap flex-col md:flex-row gap-6 md:items-start items-center justify-center my-6">
        <section className="w-[70%] flex flex-wrap flex-col gap-6">
          <section className="p-8 shadow-md rounded-xl dark:bg-card">
            <h2 className="my-3">Qui sommes-nous?</h2>
            <p className=" ">
              Le Club Rhodanien de Mölkky (CRHOM) est une association conviviale
              qui rassemble des passionné·e·s de ce jeu d’adresse d’origine
              finlandaise. Créé par des amateurs souhaitant partager leur
              enthousiasme pour le mölkky, le club s’adresse à toutes et tous,
              quel que soit l’âge ou le niveau.
            </p>
          </section>
          <section className="p-8 shadow-md rounded-xl dark:bg-card">
            <h2 className="my-3  ">Notre objectif</h2>
            <p className=" ">
              Faire découvrir le plaisir de jouer ensemble, développer la
              pratique du mölkky dans le Rhône et créer une véritable communauté
              autour de valeurs de convivialité, de respect et de fair-play.
            </p>
          </section>
          <section className="p-8 shadow-md rounded-xl dark:bg-card">
            <h2 className="my-3  ">Nos valeurs</h2>
            <p className=" ">
              Le CRHOM défend une pratique conviviale, intergénérationnelle et
              inclusive. Chez nous, pas besoin d’être un expert pour s’amuser :
              le mölkky est un jeu simple, accessible à tous, où la bonne humeur
              prime toujours sur le résultat.
            </p>
          </section>
          <section className="p-8 shadow-md rounded-xl dark:bg-card">
            <h2 className="my-3  ">Pourquoi nous rejoindre ?</h2>
            <ul className="flex flex-col gap-2 pl-5">
              <li className=" ">
                🪵 Partager des moments chaleureux et sportifs
              </li>
              <li className=" ">
                ✋ Découvrir ou perfectionner sa pratique du mölkky
              </li>
              <li className=" ">
                🤾‍♂️ Rencontrer de nouvelles personnes dans une ambiance
                bienveillante
              </li>
              <li className=" ">
                🎯 Représenter le Rhône lors de compétitions
              </li>
            </ul>
          </section>
        </section>
        <section className="md:w-[25%] w-[70%] p-8 shadow-md rounded-xl flex flex-col justify-center dark:bg-card">
          <h2 className="my-3  ">Le bureau du club</h2>
          <article className="w-[90%] h-[20em] flex flex-col justify-around items-center">
            <h3 className="my-2  ">Le président</h3>
            <Image
              src="/images/responsable1.jpg"
              alt="le président"
              width={200}
              height={200}
              className="rounded-xl shadow-2xs w-[90%]"
            />
            <p className=" ">Timothée Van Den Bosch</p>
          </article>
          <article className="w-[90%] h-[20em] flex flex-col justify-around items-center">
            <h3 className="my-2  ">L'administratif</h3>
            <Image
              src="/images/responsable2.jpg"
              alt="le président"
              width={200}
              height={200}
              className="rounded-xl shadow-2xs w-[90%]"
            />
            <p className=" ">Marion Vieillard</p>
          </article>
          <article className="w-[90%] h-[20em] flex flex-col justify-around items-center">
            <h3 className="my-2  ">Le comptable</h3>
            <Image
              src="/images/responsable3.jpg"
              alt="le président"
              width={200}
              height={200}
              className="rounded-xl shadow-2xs w-[90%]"
            />
            <p className=" ">Guerric Cochelin</p>
          </article>
        </section>
      </section>
    </article>
  );
}

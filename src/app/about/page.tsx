import Image from "next/image";

export default function Page() {
  return (
    <div className="w-[90vw] m-auto container px-15">
      <h1>Qui sommes-nous?</h1>
      <p>
        Le Club Rhodanien de Mölkky (CRHOM) est une association conviviale qui
        rassemble des passionné·e·s de ce jeu d’adresse d’origine finlandaise.
        Créé par des amateurs souhaitant partager leur enthousiasme pour le
        mölkky, le club s’adresse à toutes et tous, quel que soit l’âge ou le
        niveau.
      </p>
      <div className="overflow-hidden relative rounded-md">
        <Image
          src="/images/chrom-team.jpeg"
          alt="CHROM team"
          width={500}
          height={300}
          className="my-5 m-auto"
        />
      </div>
      <h3>Notre objectif :</h3>
      <p>
        Faire découvrir le plaisir de jouer ensemble, développer la pratique du
        mölkky dans le Rhône et créer une véritable communauté autour de valeurs
        de convivialité, de respect et de fair-play.
      </p>
      <h2>Nos valeurs</h2>
      <p>
        Le CRHOM défend une pratique conviviale, intergénérationnelle et
        inclusive. Chez nous, pas besoin d’être un expert pour s’amuser : le
        mölkky est un jeu simple, accessible à tous, où la bonne humeur prime
        toujours sur le résultat.
      </p>
      <h2>Pourquoi nous rejoindre ?</h2>
      <ul className="flex flex-col gap-5">
        <li>Partager des moments chaleureux et sportifs</li>
        <li>Découvrir ou perfectionner sa pratique du mölkky</li>
        <li>
          Rencontrer de nouvelles personnes dans une ambiance bienveillante
        </li>
        <li>Représenter le Rhône lors de compétitions</li>
      </ul>
    </div>
  );
}

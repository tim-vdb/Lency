import Link from 'next/link';

export default function FooterNavbar() {
  return (
    <>
      <div className="flex flex-col items-start md:items-center">
        <h3 className="text-lg">Entreprise</h3>
        <ul className="space-y-4 ">
          <li>
            <Link href="/features" className="transition">
              Fonctionnalités
            </Link>
          </li>
          <li>
            <Link href="/solution" className="transition">
              Solution
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="transition">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href="/about" className="transition">
              À propos
            </Link>
          </li>
          <li>
            <Link href="/contact" className="transition">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/team" className="transition">
              Équipe
            </Link>
          </li>
          <li>
            <Link href="/blog" className="transition">
              Blog
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg">Ressources</h3>
        <ul className="space-y-4 ">
          <li>
            <Link href="/docs" className="transition">
              Documentation
            </Link>
          </li>
          <li>
            <Link href="/changelog" className="transition">
              Changelog
            </Link>
          </li>
          <li>
            <Link href="/guides" className="transition">
              Guides
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

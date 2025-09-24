import { getUser } from "@/lib/auth-session";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export default async function Profil() {
  const user = await getUser();

  return (
    <article className="p-8 lg:px-24">
      <h1 className="mb-8 text-center">Mon compte</h1>
      <div className="flex flex-row  justify-around items-center gap-12 rounded-xl p-8 shadow-md">
        <section>
          {user.image && user.image !== undefined && (
            <Image
              src={user.image}
              alt="photo de profil"
              width={150}
              height={150}
              className="rounded-full"
            />
          )}
        </section>
        <section>
          <h2 className="mt-2 mb-2">{user.name}</h2>
          <p>{user.email}</p>
          <p>Date d'inscription : {formatDate(user.createdAt)}</p>
        </section>
      </div>
    </article>
  );
}

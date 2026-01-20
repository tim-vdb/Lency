import unauthorized from '@/app/unauthorized';
import Gallery from '@/front/components/Gallery/Gallery';
import { getUser } from '@/back/lib/auth-session';
import { GetImages } from '@/back/repositories/images.action';

export default async function page() {
  const images = await GetImages();
  const user = await getUser();

  if (user?.role !== 'ADMIN') {
    return unauthorized();
  }

  return (
    <section className="mx-10 my-5 p-8 shadow-md rounded-xl">
      <h2>Galeries d'Images</h2>
      <Gallery images={images} />
    </section>
  );
}

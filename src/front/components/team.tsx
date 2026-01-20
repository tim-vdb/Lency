import { cn } from '@/front/lib/utils';
import Link from 'next/link';

const members = [
  {
    name: 'Timothée VAN DEN BOSCH',
    role: 'Founder - Developer - CTO',
    avatar: '/images/team/Timothée_VDB.webp',
    linkedIn: 'https://www.linkedin.com/in/timothee-van-den-bosch',
    portfolio: 'https://tim-vdb.github.io',
  },
  {
    name: 'Nolan CAZAIN',
    role: 'Co-Founder - Videographer - CEO',
    avatar: '/images/team/Nolan_CAZAIN.avif',
    linkedIn: 'https://www.linkedin.com/in/no5',
    portfolio: 'https://nolancazain.com',
  },
  {
    name: 'Guerric COCHELIN',
    role: 'Developer - CFO',
    avatar: '/images/team/Guerric_COCHELIN.png',
    linkedIn: 'https://www.linkedin.com/in/guerric-cochelin-497ab61b1',
    portfolio: 'https://guerricco.github.io/portfolio',
  },
  {
    name: 'Alyssia HUSS',
    role: 'UX Engeneer',
    avatar: '/images/team/Alyssia_HUSS.jpg',
    linkedIn: 'https://www.linkedin.com/in/alyssia-huss-875519214',
    portfolio: 'https://alyssiahuss.framer.ai',
  },
  {
    name: 'Alexandre BOULET',
    role: 'Chief Marketing Officer',
    avatar: '/images/team/Alexandre_BOULET.png',
    linkedIn: 'https://www.linkedin.com/in/alexandre-boulet-176791291',
  },
];

export default function TeamSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl border-t px-6">
        <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">
          Team
        </span>
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl mt-0">
              Our dream team
            </h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p>
              During the working process, we perform regular fitting with the
              client because he is the only person who can feel whether a new
              suit fits or not.
            </p>
          </div>
        </div>
        <div className="mt-12 md:mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => (
              <div key={index} className="group group/image overflow-hidden">
                <div
                  className={cn(
                    'bg-neutral-900 overflow-hidden rounded-md',
                    member.name === 'Timothée VAN DEN BOSCH' ||
                      member.name === 'Guerric COCHELIN' ||
                      member.name === 'Alexandre BOULET'
                      ? 'dark:bg-white'
                      : ''
                  )}
                >
                  <img
                    className={cn(
                      'h-96 w-full object-cover object-top grayscale transition-all duration-500 group-hover/image:grayscale-0 group-hover/image:h-90 rounded-md',
                      member.name === 'Timothée VAN DEN BOSCH' &&
                      'translate-y-16 -translate-x-2 rounded-none',
                      member.name === 'Guerric COCHELIN' &&
                      'translate-y-20 -translate-x-2 rounded-none'
                    )}
                    src={member.avatar}
                    alt={member.name}
                    width="826"
                    height="1239"
                  />
                </div>
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {member.name}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={member.linkedIn}
                      className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      {' '}
                      LinkedIn
                    </Link>
                    {member.portfolio && (
                      <Link
                        href={member.portfolio}
                        className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        {' '}
                        Portfolio
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

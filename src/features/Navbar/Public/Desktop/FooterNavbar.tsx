import Link from 'next/link'

export default function FooterNavbar() {
    return (
        <>
            <div className="flex flex-col items-start md:items-center">
                <h3 className="text-lg">Company</h3>
                <ul className="space-y-4 ">
                    <li>
                        <Link href="/about" className="transition">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog" className="transition">
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="transition">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/team" className="transition">
                            Our Team
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg">Resources</h3>
                <ul className="space-y-4 ">
                    <li>
                        <Link href="/docs" className="transition">
                            Docs
                        </Link>
                    </li>
                    <li>
                        <Link href="/changelog" className="transition">
                            Changelog
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/guides"
                            className="transition"
                        >
                            Guides
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

import Link from "next/link";
import styles from "./layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/events">Events</Link>
        <Link href="/admin/users">Users</Link>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

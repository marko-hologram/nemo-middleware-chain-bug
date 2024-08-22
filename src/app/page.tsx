import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>INDEX PAGE NEMO MIDDLEWARE CHAIN BUG</h1>
      <Link href="/admin">Admin &nbsp;</Link>
      <Link href="/dashboard">Dashboard &nbsp;</Link>
      <Link href="/skip">Skippable Middleware</Link>
    </main>
  );
}

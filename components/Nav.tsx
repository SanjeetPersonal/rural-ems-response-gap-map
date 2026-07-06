import Link from "next/link";

const links = [
  { href: "/", label: "Map" },
  { href: "/guide", label: "First-Aid Guide" },
  { href: "/methodology", label: "Methodology" },
];

export function Nav() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Rural EMS Response Gap Map
        </Link>
        <nav className="flex gap-5 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-200 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

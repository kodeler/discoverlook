import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/buttons/LogoutButton";
import {getServerSession} from "next-auth";
import Image from 'next/image'; // Importa Image de next/image
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="bg-white border-b py-4">
      <div className="max-w-4xl flex justify-between mx-auto px-6">
        <div className="flex items-center gap-6">
          <Link href={'/'}>
            {/* Usa el componente Image para mostrar tu logo */}
            <icon className="flex items-center gap-2">
              <Image src="/img/logo.png" alt="Logo" width={150} height={70} />
            </icon>
          </Link>
          <nav className="flex items-center gap-4 text-slate-500 text-sm">
            <Link href={'/about'}>About</Link>
            <Link href={'/pricing'}>Pricing</Link>
            <Link href={'/api-services'}>API services</Link>
            <Link href={'/contact'}>Contact</Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm text-slate-500">
          {!!session && (
            <>
              <Link href={'/account'}>
                Hello, {session?.user?.name}
              </Link>
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              <Link href={'/login'}>Sign In</Link>
              <Link href={'/signup'}>Create Account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

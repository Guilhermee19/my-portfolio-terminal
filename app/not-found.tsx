import Link from "next/link";
import { Screen404 } from "@/components/terminal";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Screen404 hint="o endereço que você digitou não existe neste sistema." />
      <Link
        href="/"
        className="brk mt-8 border border-grn px-6 py-3 text-[11px] tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
      >
        » VOLTAR AO SISTEMA
      </Link>
    </main>
  );
}

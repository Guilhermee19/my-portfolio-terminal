/**
 * Quantos repositórios públicos o perfil tem, direto da API do GitHub.
 *
 * Roda no servidor, na renderização da página — não no navegador de quem
 * visita. A API sem token dá 60 requisições por hora **por IP**: no servidor
 * isso é uma chamada por hora no total (`revalidate`), no cliente seria uma
 * por visitante, com o IP do visitante pagando a conta.
 *
 * Devolve `null` se a API cair ou mudar de formato — aí a página mantém o
 * número congelado do `lib/data.ts`. O card nunca fica vazio nem quebra o build.
 */
import { profile } from "@/lib/data";

const HOUR = 3600;

export async function publicRepos(): Promise<number | null> {
  try {
    const r = await fetch(
      `https://api.github.com/users/${profile.githubUser}`,
      {
        headers: { accept: "application/vnd.github+json" },
        next: { revalidate: HOUR },
      },
    );
    if (!r.ok) return null;

    const { public_repos } = (await r.json()) as { public_repos?: unknown };
    return typeof public_repos === "number" ? public_repos : null;
  } catch {
    return null;
  }
}

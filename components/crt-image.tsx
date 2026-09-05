import Image from "next/image";

/**
 * Imagem com o tratamento de tubo (ver `crt-shot` no globals.css): a foto
 * fica monocromática na cor do tema, com scanline e brilho por cima — e o
 * mouse em cima devolve o arquivo original.
 * Sem `src`, desenha o placeholder — o site nasceu sem imagem nenhuma e
 * continua funcionando assim.
 */
export default function CrtImage({
  src,
  alt,
  filtered = true,
  priority = false,
  className = "",
}: {
  src?: string;
  alt: string;
  /** false mostra o arquivo cru — é o `VER ORIGINAL` do popup */
  filtered?: boolean;
  priority?: boolean;
  className?: string;
}) {
  if (!src)
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-grn/20 bg-grn/[0.02] ${className}`}
        aria-hidden
      >
        <div className="text-center">
          <div className="text-2xl text-grn/25">▚▚▚</div>
          <div className="lbl mt-2">NO SIGNAL</div>
        </div>
      </div>
    );

  return (
    <div className={`${filtered ? "crt-shot" : "relative overflow-hidden bg-black"} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, 700px"
        priority={priority}
        className="object-contain"
      />
      {filtered && (
        <>
          <div
            data-crt
            aria-hidden
            className="pointer-events-none absolute inset-0 crt-scan opacity-50 mix-blend-multiply"
          />
          <div
            data-crt
            aria-hidden
            className="pointer-events-none absolute inset-0 crt-glow"
          />
        </>
      )}
    </div>
  );
}

/**
 * QR Code SIMULADO: desenha um padrão com cara de QR (com os 3 "olhos" de posição)
 * a partir de um hash do payload. É determinístico, mas não é escaneável:
 * gerar um QR real exigiria um encoder (Reed-Solomon) ou uma biblioteca extra.
 */
const SIZE = 25;
const FINDER = 7;

/** Hash FNV-1a -> semente do gerador pseudoaleatório. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function isInFinderArea(x: number, y: number): boolean {
  const near = (v: number) => v <= FINDER;
  const far = (v: number) => v >= SIZE - FINDER - 1;
  return (near(x) && near(y)) || (far(x) && near(y)) || (near(x) && far(y));
}

function buildModules(payload: string): Array<[number, number]> {
  let seed = hash(payload) || 1;
  // xorshift32: rápido e suficiente para um desenho decorativo.
  const next = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xffffffff;
  };

  const modules: Array<[number, number]> = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!isInFinderArea(x, y) && next() > 0.5) modules.push([x, y]);
    }
  }
  return modules;
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} className="fill-ink" />
      <rect x={x + 1} y={y + 1} width={5} height={5} className="fill-white" />
      <rect x={x + 2} y={y + 2} width={3} height={3} className="fill-ink" />
    </g>
  );
}

export function PixQrCode({ payload, label }: { payload: string; label: string }) {
  const modules = buildModules(payload);

  return (
    <svg
      viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`}
      role="img"
      aria-label={label}
      className="size-44 rounded-xl bg-white"
      shapeRendering="crispEdges"
    >
      {modules.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="fill-ink" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={SIZE - FINDER} y={0} />
      <Finder x={0} y={SIZE - FINDER} />
    </svg>
  );
}

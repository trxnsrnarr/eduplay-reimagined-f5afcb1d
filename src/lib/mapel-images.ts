// Registry untuk ilustrasi AI per mapel. Slug → URL ES6 import.
// Mapel tanpa entry akan fallback ke picsum (deterministik per slug).

import matematika from "@/assets/mapel/matematika.jpg";
import fisika from "@/assets/mapel/fisika.jpg";
import biologi from "@/assets/mapel/biologi.jpg";
import kimia from "@/assets/mapel/kimia.jpg";
import bahasaInggris from "@/assets/mapel/bahasa-inggris.jpg";
import bahasaIndonesia from "@/assets/mapel/bahasa-indonesia.jpg";
import webDev from "@/assets/mapel/web-dev.jpg";
import devops from "@/assets/mapel/devops.jpg";
import cloud from "@/assets/mapel/cloud.jpg";
import ai from "@/assets/mapel/ai.jpg";
import cyber from "@/assets/mapel/cyber.jpg";
import jaringan from "@/assets/mapel/jaringan.jpg";
import ipa from "@/assets/mapel/ipa.jpg";
import ips from "@/assets/mapel/ips.jpg";
import sejarah from "@/assets/mapel/sejarah.jpg";
import ekonomi from "@/assets/mapel/ekonomi.jpg";
import geografi from "@/assets/mapel/geografi.jpg";
import sosiologi from "@/assets/mapel/sosiologi.jpg";
import pemrograman from "@/assets/mapel/pemrograman.jpg";
import mobileDev from "@/assets/mapel/mobile-dev.jpg";
import database from "@/assets/mapel/database.jpg";
import uiux from "@/assets/mapel/uiux.jpg";
import iot from "@/assets/mapel/iot.jpg";
import linuxServer from "@/assets/mapel/linux-server.jpg";
import seni from "@/assets/mapel/seni.jpg";
import olahraga from "@/assets/mapel/olahraga.jpg";

// Map slug exact → image. Slug yang mirip (mis. mtk-sd, mtk-smp, mtk-wajib)
// di-route via prefix/keyword di getMapelImage().
const EXACT: Record<string, string> = {
  "web-dev": webDev,
  "web-prog": webDev,
  "react-fw": webDev,
  "devops": devops,
  "cloud": cloud,
  "ai": ai,
  "ml": ai,
  "rpl-ai": ai,
  "cyber-sec": cyber,
  "rpl-sec": cyber,
  "jaringan": jaringan,
  "jarkom": jaringan,
  "mikrotik": jaringan,
  "fiber": jaringan,
  "fisika": fisika,
  "biologi": biologi,
  "kimia": kimia,
  "bing-sd": bahasaInggris,
  "bing-smp": bahasaInggris,
  "bing-sma": bahasaInggris,
  "bin-sd": bahasaIndonesia,
  "bin-smp": bahasaIndonesia,
  "bin-sma": bahasaIndonesia,
  "mtk-sd": matematika,
  "mtk-smp": matematika,
  "mtk-wajib": matematika,
  "mtk-peminatan": matematika,
  "mtk-dasar": matematika,
  "ipa-sd": ipa,
  "ipa-smp": ipa,
  "ips-sd": ips,
  "ips-smp": ips,
  "sejarah": sejarah,
  "ekonomi": ekonomi,
  "geografi": geografi,
  "sosiologi": sosiologi,
  "pemrograman": pemrograman,
  "info-smp": pemrograman,
  "mobile-dev": mobileDev,
  "database": database,
  "uiux": uiux,
  "iot": iot,
  "linux-server": linuxServer,
  "admin-sys": linuxServer,
  "sbk-sd": seni,
  "sbk-sma": seni,
  "pjok-sd": olahraga,
  "pjok-sma": olahraga,
};


// Prefix → image (untuk grup besar mis. semua sija-* atau rpl-*).
const PREFIX: Array<[string, string]> = [
  ["sija-", jaringan],
  ["rpl-frontend", webDev],
  ["rpl-backend", devops],
  ["rpl-full", webDev],
  ["rpl-cloudapp", cloud],
];

export function getMapelImage(slug: string): string | null {
  if (EXACT[slug]) return EXACT[slug];
  for (const [pfx, img] of PREFIX) {
    if (slug.startsWith(pfx)) return img;
  }
  return null;
}

export function getMapelImageWithFallback(slug: string): string {
  const real = getMapelImage(slug);
  if (real) return real;
  // Fallback: picsum deterministik per slug.
  const seed = encodeURIComponent(slug.toLowerCase());
  return `https://picsum.photos/seed/eduverse-${seed}/1280/768`;
}

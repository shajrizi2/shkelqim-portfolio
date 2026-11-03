import sharp from 'sharp';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('public/social', { recursive: true });
const source = await readFile('src/data/portfolio.ts', 'utf8');
const images = [...new Set([...source.matchAll(/"(\/projects\/[^"\n]+\.(?:png|webp))"/g)].map(match => match[1]))];
let before = 0, after = 0;
for (const image of images) {
  const original = `public${image.replace(/\.webp$/, '.png')}`;
  const target = original.replace(/\.png$/, '.webp');
  if (!existsSync(original)) continue;
  before += (await stat(original)).size;
  await sharp(original).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(target);
  after += (await stat(target)).size;
}
if (source.includes('.png"')) await writeFile('src/data/portfolio.ts', source.replace(/(\/projects\/[^"\n]+)\.png"/g, '$1.webp"'));

const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cards = [
  ['portfolio', 'Senior Full-Stack', '& AI Engineer', 'AI integrations · Automation · Custom software', 'Kosovo, Europe · Remote collaboration · US-hours overlap'],
  ['work', 'Software, AI', '& real project work.', 'SaaS · AI automation · WordPress · Shopify', 'Architecture, integrations and engineering decisions'],
  ['hyrjedalje', 'HyrjeDalje', 'Workforce SaaS', 'Next.js · NestJS · PostgreSQL · AWS', 'Multi-tenant attendance, devices and reporting'],
  ['wondertales', 'WonderTales', 'AI Story Platform', 'Next.js · Generative AI · AWS Lambda · S3', 'Personalized stories, illustrations and commerce'],
  ['kosovo-police', 'Kosovo Police', 'Public Portal', 'WordPress · PHP · Data integrations · AWS', 'Custom engineering and public statistics publishing'],
  ['menmin-made', 'Menmin Made', 'Shopify & AI', 'Shopify · Claude · Lambda · SQS', 'E-commerce and assisted store administration'],
  ['order-extraction', 'AI Order', 'Extraction', 'Chatwoot · Lambda · SQS · DynamoDB', 'From customer conversations to structured orders'],
];
for (const [slug, line1, line2, stack, summary] of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#0b0d0f"/>
    <defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#29302b" stroke-width="1"/></pattern></defs>
    <rect x="800" width="400" height="630" fill="url(#grid)" opacity=".5"/>
    <rect x="60" y="52" width="52" height="52" fill="#141815" stroke="#b7f12a"/>
    <text x="86" y="85" fill="#b7f12a" font-family="Arial,sans-serif" font-size="20" text-anchor="middle">SH</text>
    <text x="132" y="85" fill="#f0f3f1" font-family="Arial,sans-serif" font-size="24">Shkelqim Hajrizi</text>
    <text x="1140" y="85" fill="#abb5ad" font-family="Arial,sans-serif" font-size="21" text-anchor="end">hajrizi.dev</text>
    <text x="60" y="236" fill="#f0f3f1" font-family="Arial,sans-serif" font-size="76" font-weight="700" letter-spacing="-3">${escape(line1)}</text>
    <text x="60" y="324" fill="#b7f12a" font-family="Arial,sans-serif" font-size="76" font-weight="700" letter-spacing="-3">${escape(line2)}</text>
    <text x="63" y="403" fill="#cbd2cd" font-family="Arial,sans-serif" font-size="27">${escape(stack)}</text>
    <line x1="60" y1="502" x2="1140" y2="502" stroke="#39453b"/>
    <text x="63" y="552" fill="#abb5ad" font-family="Arial,sans-serif" font-size="23">${escape(summary)}</text>
    <path d="M1092 540h30v-30m0 0-35 35" stroke="#b7f12a" stroke-width="3" fill="none"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`public/social/${slug}.png`);
}
console.log(`Prepared ${images.length} screenshots: ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB. Generated ${cards.length} share images.`);

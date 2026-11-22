import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('🧪 Starting Mohamed Reda 3D Portfolio Verification Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Check Dist & Production Assets
console.log('--- 1. Checking Build Artifacts ---');
assert(existsSync(resolve('dist/index.html')), 'dist/index.html was built');
assert(existsSync(resolve('dist/mohamed-reda.jpg')), 'dist/mohamed-reda.jpg is present (user photograph)');
assert(existsSync(resolve('dist/assets/projects/hero_roastery.jpg')), 'dist/assets/projects/hero_roastery.jpg is present (Mazag Coffee)');
assert(existsSync(resolve('dist/assets/projects/beans_bag.jpg')), 'dist/assets/projects/beans_bag.jpg is present (Mazag Coffee beans)');
assert(existsSync(resolve('dist/assets/projects/iced_coffee.jpg')), 'dist/assets/projects/iced_coffee.jpg is present (Mazag Coffee iced)');
assert(existsSync(resolve('dist/assets/projects/turkish_coffee.jpg')), 'dist/assets/projects/turkish_coffee.jpg is present (Mazag Coffee turkish)');

// 2. Check HTML Metadata & Open Graph
console.log('\n--- 2. Checking HTML & SEO Metadata ---');
const htmlContent = readFileSync(resolve('dist/index.html'), 'utf-8');
assert(htmlContent.includes('Mohamed Reda'), 'HTML contains "Mohamed Reda"');
assert(htmlContent.includes('Front-End Developer'), 'HTML contains "Front-End Developer"');
assert(htmlContent.includes('Zagazig'), 'HTML contains "Zagazig" location');
assert(htmlContent.includes('og:title'), 'HTML contains Open Graph title');
assert(htmlContent.includes('Space+Grotesk'), 'HTML links Google Fonts Space Grotesk');

// 3. Check Initial Data and Specifications
console.log('\n--- 3. Checking Initial Data Specifications ---');
const defaultDataFile = readFileSync(resolve('src/lib/defaultData.ts'), 'utf-8');
assert(defaultDataFile.includes('Mohamed Reda Nour Mohamed'), 'Full name specified');
assert(defaultDataFile.includes('Mohamed Reda'), 'Display name specified');
assert(defaultDataFile.includes('Front-End Developer'), 'Title specified');
assert(defaultDataFile.includes('Zagazig, Sharqia, Egypt'), 'Location specified');
assert(defaultDataFile.includes('01018274271'), 'Phone number 01018274271 specified');
assert(defaultDataFile.includes('mooreda542@gmail.com'), 'Email mooreda542@gmail.com specified');
assert(defaultDataFile.includes('Mazag Coffee'), 'Initial project: Mazag Coffee present');
assert(defaultDataFile.includes('Smart Home Energy Saving System'), 'Initial project: Smart Home Energy Saving System present');
assert(defaultDataFile.includes('Arduino'), 'Graduation project includes Arduino');

// 4. Check All 12 Required Skills
console.log('\n--- 4. Checking All 12 Required Skills ---');
const requiredSkills = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'TypeScript',
  'React',
  'Tailwind CSS',
  'Bootstrap',
  'Git',
  'GitHub',
  'Vite',
  'Next.js',
  'Antigravity',
];

requiredSkills.forEach(skill => {
  assert(defaultDataFile.includes(skill), `Required skill included: ${skill}`);
});

// 5. Check Strict Absence of LinkedIn or other social accounts
console.log('\n--- 5. Checking Strict Absence of LinkedIn / Other Social Accounts ---');
const contactFile = readFileSync(resolve('src/components/sections/Contact.tsx'), 'utf-8');
const heroFile = readFileSync(resolve('src/components/sections/Hero.tsx'), 'utf-8');
const navbarFile = readFileSync(resolve('src/components/sections/Navbar.tsx'), 'utf-8');
const footerFile = readFileSync(resolve('src/components/sections/Footer.tsx'), 'utf-8');

assert(!contactFile.toLowerCase().includes('linkedin'), 'Contact section does NOT contain LinkedIn');
assert(!heroFile.toLowerCase().includes('linkedin'), 'Hero section does NOT contain LinkedIn');
assert(!navbarFile.toLowerCase().includes('linkedin'), 'Navbar does NOT contain LinkedIn');
assert(!footerFile.toLowerCase().includes('linkedin'), 'Footer does NOT contain LinkedIn');

assert(contactFile.includes('tel:'), 'Contact section contains clickable tel: protocol');
assert(contactFile.includes('mailto:'), 'Contact section contains clickable mailto: protocol');
assert(contactFile.includes('{profile.phone}'), 'Contact section renders dynamic profile phone');
assert(contactFile.includes('{profile.email}'), 'Contact section renders dynamic profile email');

// 6. Check 3D WebGL Scene & React Three Fiber implementation
console.log('\n--- 6. Checking 3D Interactive WebGL Implementation ---');
const hero3dFile = readFileSync(resolve('src/components/3d/Hero3DCanvas.tsx'), 'utf-8');
assert(hero3dFile.includes('@react-three/fiber'), 'Uses @react-three/fiber');
assert(hero3dFile.includes('@react-three/drei'), 'Uses @react-three/drei');
assert(hero3dFile.includes('torusKnotGeometry'), '3D geometry: torusKnotGeometry present');
assert(hero3dFile.includes('octahedronGeometry'), '3D geometry: octahedronGeometry present');
assert(hero3dFile.includes('icosahedronGeometry'), '3D geometry: icosahedronGeometry present');
assert(hero3dFile.includes('dodecahedronGeometry'), '3D geometry: dodecahedronGeometry present');
assert(hero3dFile.includes('Sparkles'), '3D particles: Sparkles present');
assert(hero3dFile.includes('prefers-reduced-motion'), 'Respects prefers-reduced-motion');
assert(hero3dFile.includes('SceneFallback'), 'Provides graceful fallback for unsupported devices');

// 7. Check Admin Dashboard & Supabase Integration
console.log('\n--- 7. Checking Admin Dashboard & Supabase Integration ---');
const adminDashboardFile = readFileSync(resolve('src/components/admin/AdminDashboard.tsx'), 'utf-8');
const profileManagerFile = readFileSync(resolve('src/components/admin/ProfileManager.tsx'), 'utf-8');
const projectManagerFile = readFileSync(resolve('src/components/admin/ProjectManager.tsx'), 'utf-8');
const skillManagerFile = readFileSync(resolve('src/components/admin/SkillManager.tsx'), 'utf-8');
const supabaseSettingsFile = readFileSync(resolve('src/components/admin/SupabaseSettingsModal.tsx'), 'utf-8');
const supabaseSqlFile = readFileSync(resolve('supabase_schema.sql'), 'utf-8');

assert(adminDashboardFile.includes('Profile Information'), 'Admin includes Profile Information tab');
assert(adminDashboardFile.includes('Projects Management'), 'Admin includes Projects Management tab');
assert(adminDashboardFile.includes('Skills & Stack'), 'Admin includes Skills & Stack tab');
assert(adminDashboardFile.includes('Cloud Sync & Supabase'), 'Admin includes Cloud Sync & Supabase tab');

assert(profileManagerFile.includes('Upload New Photo'), 'Profile manager supports photo uploading');
assert(profileManagerFile.includes('Reset Original'), 'Profile manager supports resetting original photo');
assert(profileManagerFile.includes('Delete'), 'Profile manager supports photo deletion');

assert(projectManagerFile.includes('Add New Project'), 'Project manager supports adding new projects');
assert(projectManagerFile.includes('Edit Project'), 'Project manager supports editing projects');
assert(projectManagerFile.includes('deleteProject'), 'Project manager supports deleting projects');

assert(skillManagerFile.includes('Add New Skill'), 'Skill manager supports adding skills');
assert(skillManagerFile.includes('deleteSkill'), 'Skill manager supports deleting skills');

assert(existsSync(resolve('supabase_schema.sql')), 'supabase_schema.sql exists with full table definitions & RLS');
assert(supabaseSqlFile.includes('create table if not exists public.profile'), 'Supabase schema defines profile table');
assert(supabaseSqlFile.includes('create table if not exists public.projects'), 'Supabase schema defines projects table');
assert(supabaseSqlFile.includes('create table if not exists public.skills'), 'Supabase schema defines skills table');
assert(supabaseSqlFile.includes('portfolio-assets'), 'Supabase schema configures portfolio-assets storage bucket');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

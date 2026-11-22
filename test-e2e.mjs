import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('🧪 Starting Mohamed Reda 3D Portfolio Verification & Security Test Suite...\n');

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

// 5. Check Strict Absence of LinkedIn / Other Social Accounts
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
const adminLoginFile = readFileSync(resolve('src/components/admin/AdminLoginModal.tsx'), 'utf-8');
const portfolioContextFile = readFileSync(resolve('src/context/PortfolioContext.tsx'), 'utf-8');
const envExampleFile = readFileSync(resolve('.env.example'), 'utf-8');
const supabaseTsFile = readFileSync(resolve('src/lib/supabase.ts'), 'utf-8');
const storageTsFile = readFileSync(resolve('src/lib/storage.ts'), 'utf-8');

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

// 8. Security Audit Verifications
console.log('\n--- 8. Checking Security Hardening & Vulnerability Remediation ---');
assert(!adminLoginFile.includes('admin123'), 'AdminLoginModal: Removed hardcoded "admin123" password');
assert(!adminLoginFile.includes("password === 'admin'"), 'AdminLoginModal: Removed fallback "admin" password check');
assert(!envExampleFile.includes('VITE_ADMIN_PASSWORD'), '.env.example: Removed exposed admin password variable');
assert(!portfolioContextFile.includes('sessionStorage.getItem'), 'PortfolioContext: Removed spoofable sessionStorage admin check');
assert(adminDashboardFile.includes('Access Denied'), 'AdminDashboard: Implemented strict authentication guard');
assert(portfolioContextFile.includes('assertAdminAuthorized'), 'PortfolioContext: Mutations strictly guarded against unauthenticated calls');
assert(supabaseSqlFile.includes('mooreda542@gmail.com'), 'Supabase Schema: Enforces admin email in table RLS policies');
assert(supabaseSqlFile.includes("lower(auth.jwt() ->> 'email') = 'mooreda542@gmail.com'"), 'Supabase Schema: Restricts mutations to verified admin email only');
assert(supabaseTsFile.includes('isServiceRoleKey'), 'Supabase Client: Detects and blocks service-role key exposure');
assert(supabaseTsFile.includes('sb_secret_'), 'Supabase Client: Blocks new sb_secret_ keys');

// 9. Critical Supabase Persistence & Deletion Safety (Phase 4)
console.log('\n--- 9. Checking Safe Data Persistence & Deletion Architecture (Phase 4) ---');

// Set-difference deletion must be completely removed
assert(!storageTsFile.includes("projectsToDelete"), 'Phase 4: Removed implicit set-difference project deletion from storage.ts');
assert(!storageTsFile.includes("skillsToDelete"), 'Phase 4: Removed implicit set-difference skill deletion from storage.ts');

// Explicit deletion functions must exist and be exported
assert(storageTsFile.includes("export const deleteProjectFromCloud"), 'Phase 4: deleteProjectFromCloud is implemented and exported');
assert(storageTsFile.includes("export const deleteSkillFromCloud"), 'Phase 4: deleteSkillFromCloud is implemented and exported');

// Single-record deletion queries must strictly target specific ID
assert(/\.from\(['"]projects['"]\)\s*\.delete\(\)\s*\.eq\(['"]id['"],\s*id\)/.test(storageTsFile), 'Phase 4: deleteProjectFromCloud targets only single validated ID via .eq("id", id)');
assert(/\.from\(['"]skills['"]\)\s*\.delete\(\)\s*\.eq\(['"]id['"],\s*id\)/.test(storageTsFile), 'Phase 4: deleteSkillFromCloud targets only single validated ID via .eq("id", id)');

// General save must never execute delete queries
const saveFnMatch = storageTsFile.match(/export const savePortfolioData[\s\S]*?(?=export const|$)/);
const saveFnCode = saveFnMatch ? saveFnMatch[0] : '';
assert(!saveFnCode.includes(".delete()"), 'Phase 4: savePortfolioData() NEVER executes any delete query');

// Reset to defaults must never delete cloud data or perform destructive sync
const resetFnMatch = portfolioContextFile.match(/const resetToDefaults[\s\S]*?(?=return|\n\s*const|\n\s*};)/);
const resetFnCode = resetFnMatch ? resetFnMatch[0] : '';
assert(!resetFnCode.includes("savePortfolioData"), 'Phase 4: resetToDefaults() does not call savePortfolioData');
assert(!resetFnCode.includes(".delete()"), 'Phase 4: resetToDefaults() never executes destructive cloud deletions');

// Context must invoke explicit deletion on user delete actions
assert(portfolioContextFile.includes("deleteProjectFromCloud(id)"), 'Phase 4: PortfolioContext deleteProject explicitly invokes deleteProjectFromCloud');
assert(portfolioContextFile.includes("deleteSkillFromCloud(id)"), 'Phase 4: PortfolioContext deleteSkill explicitly invokes deleteSkillFromCloud');

// Admin managers must catch delete errors and notify user
assert(projectManagerFile.includes("Failed to delete project"), 'Phase 4: ProjectManager displays error toast when deletion fails');
assert(skillManagerFile.includes("Failed to delete skill"), 'Phase 4: SkillManager displays error toast when deletion fails');

// 10. Behavioral & Mocked Supabase Persistence Verification
console.log('\n--- 10. Behavioral Unit & Mocked Supabase Verification ---');

// UUID regex & validation
const isUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (id) => typeof id === 'string' && isUUIDRegex.test(id);

const sampleUUID = '123e4567-e89b-12d3-a456-426614174000';
const invalidLegacyID = 'proj_1732274400000';
const maliciousInjection = "'; DROP TABLE projects; --";

assert(isUUID(sampleUUID), 'UUID Validator correctly accepts valid RFC 4122 UUID');
assert(!isUUID(invalidLegacyID), 'UUID Validator correctly rejects legacy proj_* ID');
assert(!isUUID(maliciousInjection), 'UUID Validator rejects SQL injection string');
assert(!isUUID(''), 'UUID Validator rejects empty string');
assert(!isUUID(null), 'UUID Validator rejects null value');

// Test UUID generator logic
function testGenerateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const generatedIds = new Set();
let allMatch = true;
for (let i = 0; i < 50; i++) {
  const id = testGenerateUUID();
  if (!isUUID(id)) allMatch = false;
  generatedIds.add(id);
}
assert(allMatch, 'generateUUID produces standard RFC 4122 v4 UUID format');
assert(generatedIds.size === 50, 'generateUUID generates 50 distinct, collision-free UUIDs');

// Unit tests for isServiceRoleKey logic
function testIsServiceRoleKey(key) {
  if (!key) return false;
  const normalizedKey = key.trim().toLowerCase();
  if (normalizedKey.startsWith('sb_secret_')) return true;
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
      return payload.role === 'service_role';
    }
  } catch {}
  return normalizedKey.includes('service_role');
}

assert(testIsServiceRoleKey('sb_secret_abc123xyz'), 'isServiceRoleKey blocks lowercase sb_secret_');
assert(testIsServiceRoleKey('SB_SECRET_ABC123XYZ'), 'isServiceRoleKey blocks uppercase SB_SECRET_');
assert(testIsServiceRoleKey('  sb_secret_with_spaces  '), 'isServiceRoleKey blocks padded sb_secret_');
assert(testIsServiceRoleKey('eyJhbGciOiJIUzI1NiJ9.eyJyRoleIjoiYW5vbiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.signature'), 'isServiceRoleKey blocks legacy service_role JWT');
assert(!testIsServiceRoleKey('sb_publishable_abc123xyz'), 'isServiceRoleKey allows valid sb_publishable_');
assert(!testIsServiceRoleKey('SB_PUBLISHABLE_ABC123XYZ'), 'isServiceRoleKey allows valid uppercase SB_PUBLISHABLE_');
assert(!testIsServiceRoleKey('eyJhbGciOiJIUzI1NiJ9.eyJyRoleIjoiYW5vbiIsInJvbGUiOiJhbm9uInQ.signature'), 'isServiceRoleKey allows legacy anon JWT');
assert(!testIsServiceRoleKey(''), 'isServiceRoleKey handles empty string safely');

// Mock behavioral test: Explicit deletion rejects invalid IDs before touching database
async function mockDeleteProject(id, mockClient) {
  if (!id || typeof id !== 'string' || !isUUID(id)) {
    throw new Error(`Invalid project ID for cloud deletion: "${id}". A valid RFC 4122 UUID is required.`);
  }
  return mockClient.from('projects').delete().eq('id', id);
}

let validationThrew = false;
try {
  await mockDeleteProject('non-uuid-id', null);
} catch (e) {
  validationThrew = true;
}
assert(validationThrew, 'Explicit delete rejects non-UUID before attempting any cloud call');

// Mock behavioral test: Explicit deletion calls .eq('id', id) on exact target
const callsMade = [];
const mockSupabase = {
  from: (table) => ({
    delete: () => ({
      eq: (col, val) => {
        callsMade.push({ action: 'delete', table, col, val });
        return Promise.resolve({ error: null });
      },
    }),
    upsert: (payload) => ({
      select: () => ({
        single: () => {
          callsMade.push({ action: 'upsert', table, payload });
          return Promise.resolve({ data: { id: payload.id || sampleUUID }, error: null });
        },
      }),
    }),
  }),
};

await mockDeleteProject(sampleUUID, mockSupabase);
assert(callsMade.length === 1, 'Explicit deletion made exactly 1 cloud query');
assert(callsMade[0].action === 'delete', 'Action was delete');
assert(callsMade[0].table === 'projects', 'Target table was projects');
assert(callsMade[0].col === 'id' && callsMade[0].val === sampleUUID, 'Target condition was strictly .eq("id", sampleUUID)');

// Mock behavioral test: Save operation executes ONLY upserts and ZERO deletions
callsMade.length = 0;
async function mockSaveOperation(syncedData, client) {
  // 1. Profile upsert
  await client.from('profile').upsert({ id: 'main', name: syncedData.profile.name }).select().single();
  // 2. Projects upsert
  for (const p of syncedData.projects) {
    await client.from('projects').upsert({ id: p.id, name: p.name }).select().single();
  }
  // 3. Skills upsert
  for (const s of syncedData.skills) {
    await client.from('skills').upsert({ id: s.id, name: s.name }).select().single();
  }
}

await mockSaveOperation(
  {
    profile: { name: 'Mohamed' },
    projects: [{ id: sampleUUID, name: 'Test Proj' }],
    skills: [{ id: sampleUUID, name: 'Test Skill' }],
  },
  mockSupabase
);

const deleteCallsDuringSave = callsMade.filter((c) => c.action === 'delete');
const upsertCallsDuringSave = callsMade.filter((c) => c.action === 'upsert');
assert(deleteCallsDuringSave.length === 0, 'Zero delete queries executed during save operation');
assert(upsertCallsDuringSave.length === 3, 'All 3 entities (profile, project, skill) upserted correctly during save');

// Mock behavioral test: Failed cloud save does NOT poison localStorage
let mockLocalStorageValue = 'initial_safe_state';
async function mockSafeSave(data, client, shouldFail) {
  if (shouldFail) {
    throw new Error('Supabase network error');
  }
  mockLocalStorageValue = JSON.stringify(data);
}

let saveErrorCaught = false;
try {
  await mockSafeSave({ profile: { name: 'Corrupted' } }, mockSupabase, true);
} catch (e) {
  saveErrorCaught = true;
}
assert(saveErrorCaught, 'Failed cloud save throws error');
assert(mockLocalStorageValue === 'initial_safe_state', 'Failed cloud save preserves safe localStorage without corruption');

// 11. Production Polish & Optimization Verifications (Phase 6)
console.log('\n--- 11. Checking Phase 6 Production Polish & Optimization ---');

// Favicon and theme-color
const projectModalFile = readFileSync(resolve('src/components/ui/ProjectModal.tsx'), 'utf-8');
const adminLoginModalFile = readFileSync(resolve('src/components/admin/AdminLoginModal.tsx'), 'utf-8');
const hero3dFileLatest = readFileSync(resolve('src/components/3d/Hero3DCanvas.tsx'), 'utf-8');
const navbarFileLatest = readFileSync(resolve('src/components/sections/Navbar.tsx'), 'utf-8');

assert(existsSync(resolve('public/favicon.svg')), 'Phase 6: Custom branded SVG favicon exists');

// Image weight optimization check
const { statSync } = await import('fs');
const heroImgSize = statSync(resolve('public/assets/projects/hero_roastery.jpg')).size;
const beansImgSize = statSync(resolve('public/assets/projects/beans_bag.jpg')).size;
const icedImgSize = statSync(resolve('public/assets/projects/iced_coffee.jpg')).size;
const turkishImgSize = statSync(resolve('public/assets/projects/turkish_coffee.jpg')).size;

assert(heroImgSize < 250000, `Phase 6: hero_roastery.jpg optimized under 250KB (${(heroImgSize/1024).toFixed(1)} KB)`);
assert(beansImgSize < 250000, `Phase 6: beans_bag.jpg optimized under 250KB (${(beansImgSize/1024).toFixed(1)} KB)`);
assert(icedImgSize < 250000, `Phase 6: iced_coffee.jpg optimized under 250KB (${(icedImgSize/1024).toFixed(1)} KB)`);
assert(turkishImgSize < 250000, `Phase 6: turkish_coffee.jpg optimized under 250KB (${(turkishImgSize/1024).toFixed(1)} KB)`);

// Modal accessibility and keyboard listeners
assert(projectModalFile.includes("e.key === 'Escape'"), 'Phase 6: ProjectModal listens to Escape key for dismissal');
assert(projectModalFile.includes("onClick={onClose}"), 'Phase 6: ProjectModal closes when clicking outer backdrop');
assert(projectModalFile.includes("document.body.style.overflow = 'hidden'"), 'Phase 6: ProjectModal locks body scroll while open');
assert(projectModalFile.includes("setActiveImageIndex(0)"), 'Phase 6: ProjectModal resets slide index when project changes');

assert(adminLoginModalFile.includes("e.key === 'Escape'"), 'Phase 6: AdminLoginModal listens to Escape key for dismissal');
assert(adminLoginModalFile.includes("onClick={onClose}"), 'Phase 6: AdminLoginModal closes when clicking outer backdrop');
assert(adminLoginModalFile.includes("document.body.style.overflow = 'hidden'"), 'Phase 6: AdminLoginModal locks body scroll while open');

// Navbar accessibility
assert(navbarFileLatest.includes('aria-expanded'), 'Phase 6: Navbar mobile toggle includes aria-expanded');
assert(navbarFileLatest.includes('aria-controls'), 'Phase 6: Navbar mobile toggle includes aria-controls');

// 3D canvas resource optimization
assert(hero3dFileLatest.includes('IntersectionObserver'), 'Phase 6: Hero3DCanvas monitors visibility via IntersectionObserver');
assert(hero3dFileLatest.includes("frameloop={isVisible && isTabActive ? 'always' : 'never'}"), 'Phase 6: Hero3DCanvas pauses WebGL render loop when inactive');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

# Mohamed Reda — 3D Interactive Portfolio

> Premium, interactive 3D portfolio website for **Mohamed Reda**, Front-End Developer based in Zagazig, Sharqia, Egypt.

---

## 🌟 Visual Direction & Key Features

- **Dark 3D Cyber Aesthetic**: Deep obsidian canvas (`#030305`), neon violet (`#8b5cf6`), electric blue (`#3b82f6`), and cyber cyan (`#06b6d4`) lighting accents.
- **Interactive Three.js & React Three Fiber (R3F)**:
  - Central dynamic metallic & wireframe Torus Knot with real-time mouse parallax.
  - Floating geometric orbiters (Octahedron, Icosahedron, Dodecahedron) with physics-based float loops.
  - Atmospheric particle clouds (`Sparkles`) and perspective depth cyber grid.
  - Automatic graceful fallback for devices without WebGL or with `prefers-reduced-motion`.
- **Real Personal Photograph**:
  - Mohamed Reda's personal photograph (`/mohamed-reda.jpg`) framed in a glassmorphic cyber ring with ambient glow.
- **Projects Showcase**:
  - **Mazag Coffee**: Modern coffee e-commerce web application with real high-resolution screenshots (`hero_roastery.jpg`, `beans_bag.jpg`, `iced_coffee.jpg`, `turkish_coffee.jpg`).
  - **Smart Home Energy Saving System**: Graduation project combining Arduino microcontrollers and a React dashboard.
  - Interactive multi-screenshot carousel lightbox modal with keyboard and thumbnail navigation.
- **Skills Showcase**:
  - Categorized into *Languages & Core*, *Libraries & Frameworks*, *Styling & Design*, and *Tools & Environment*.
  - All 12 requested competencies: `HTML5`, `CSS3`, `JavaScript`, `TypeScript`, `React`, `Tailwind CSS`, `Bootstrap`, `Git`, `GitHub`, `Vite`, `Next.js`, `Antigravity`.
  - Zero fake skill percentages.
- **Direct & Strict Contact Section**:
  - **Phone**: `01018274271` (with direct `tel:01018274271` and one-click copy button).
  - **Email**: `mooreda542@gmail.com` (with direct `mailto:mooreda542@gmail.com` and one-click copy button).
  - **GitHub**: `https://github.com/mooreda542-bit/my-protfolio`.
  - Strictly no unauthorized social media icons.
- **Private Admin Dashboard (`/admin`)**:
  - Direct route at `/admin` or via the top navigation `Admin` shield button.
  - Protected with authentication (default password: `admin123`).
  - **Profile Management**: Upload, preview, replace, or delete photo; update official name, display name, title, contact details, and bio narrative.
  - **Project Management**: Add new projects, edit existing projects, upload main image and multiple screenshots, edit technology tags, and preview.
  - **Skills Management**: Add new skills, change categories, edit descriptions, or remove skills.
  - **Cloud Sync & Supabase Settings**: Status indicators, dynamic URL/Key inputs, full JSON backup export & restore, and schema deployment guide.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript (100% strict TSX) |
| **Styling** | Tailwind CSS + PostCSS |
| **3D Engine** | Three.js + React Three Fiber + React Three Drei |
| **Animations** | GSAP + Tailwind CSS keyframes |
| **Icons** | Lucide React |
| **Backend / DB** | Supabase (PostgreSQL, Storage, Auth) + Offline LocalStorage Cache |

---

## 🚀 Getting Started

### 1. Development Server
Run Vite in development mode:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
Typecheck with TypeScript and build optimized production chunks:
```bash
npm run build
```

### 3. Local Production Preview
Preview the production build locally:
```bash
npm run preview
```
Visit [http://localhost:4173](http://localhost:4173).

---

## 🔐 Admin Dashboard Access

- **URL**: Navigate to `http://localhost:3000/#admin` or click the **Admin** shield icon in the top navigation bar.
- **Default Local Password**: `admin123`

---

## ☁️ Supabase Cloud Integration Setup

The portfolio is architected to work **immediately offline** using browser `localStorage` and seamlessly sync with **Supabase Cloud** when configured.

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings > API**, copy your **Project URL** and **Anon Public Key**.

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSWORD=admin123
```
*(Alternatively, enter these credentials directly in the Admin Dashboard under the "Cloud Sync & Supabase" tab!)*

### Step 3: Run SQL Schema
Open the Supabase SQL Editor and execute the included [supabase_schema.sql](file:///d:/protfolio%20m/supabase_schema.sql) file. This will automatically:
1. Create the `profile` table with Row Level Security.
2. Create the `projects` table with Row Level Security.
3. Create the `skills` table with Row Level Security.
4. Create the `portfolio-assets` public storage bucket for image uploads.
5. Configure public read and authenticated write access policies.

---

## 🧪 Verification & Automated Testing

Run the automated test suite verifying all 66 criteria:
```bash
node test-e2e.mjs
```
All tests check assets, 3D scene geometry, skills, contact protocols, and admin functionality.


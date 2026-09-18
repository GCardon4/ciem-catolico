---
name: Sancta Hildegarda
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#414942'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#3a6848'
  primary: '#003218'
  on-primary: '#ffffff'
  primary-container: '#1b492c'
  on-primary-container: '#87b892'
  inverse-primary: '#a0d2ab'
  secondary: '#765a0b'
  on-secondary: '#ffffff'
  secondary-container: '#fcd57d'
  on-secondary-container: '#775b0b'
  tertiary: '#2d2a1e'
  on-tertiary: '#ffffff'
  tertiary-container: '#434033'
  on-tertiary-container: '#b1ac9b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcefc6'
  primary-fixed-dim: '#a0d2ab'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#225032'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#e7c26c'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#e9e2d0'
  tertiary-fixed-dim: '#ccc6b4'
  on-tertiary-fixed: '#1e1c10'
  on-tertiary-fixed-variant: '#4a4739'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is built on the intersection of ancient wisdom and modern clinical excellence. It balances the monastic tradition of St. Hildegard von Bingen with contemporary medical professionalism and luxury craftsmanship.

The visual style is **Contemporary Minimalist with Traditional Accents**, focusing on heavy whitespace, refined typography, and subtle golden highlights. The emotional response should be one of peace, trust, and divine inspiration. The UI avoids clinical coldness in favor of a warm, organic, and elevated atmosphere that feels both sacred and scientific.

## Colors

This design system utilizes a palette rooted in natural and liturgical symbolism:

- **Primary (Deep Vert):** Represents vitality, the "Viriditas" (greening power) of St. Hildegard, and spiritual growth. Used for key brand moments and medical authority.
- **Secondary (Ochre Gold):** Represents the divine light and the premium quality of the jewelry. Used for accents, CTAs, and decorative elements.
- **Background (Liturgical Cream):** A warm alternative to pure white, reducing eye strain and providing a parchment-like quality that feels welcoming.
- **Neutral (Carbon):** A soft dark grey for typography to ensure high readability without the harshness of pure black.

## Typography

The typographic scale uses a high-contrast pairing to distinguish between the "Spiritual/Narrative" (Serif) and the "Functional/Informational" (Sans-Serif).

- **Headlines:** Playfair Display is used for all headings. It provides an editorial, sophisticated feel. Use "Optical Size" features where available to maintain elegance at large scales.
- **Body & Interface:** Inter is used for clinical data, body copy, and dashboard elements. It ensures clarity and modern efficiency.
- **Labels:** Small labels and metadata should use Inter with increased letter spacing and uppercase styling to denote hierarchy and organization.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for content-heavy pages and a **Fluid Sidebar** approach for the admin dashboard.

- **Content Layout:** Use a 12-column grid with a maximum width of 1280px. Large margins (64px) on desktop are essential to evoke a sense of luxury and calm.
- **Dashboard Layout:** A persistent left navigation (280px) with a fluid content area. Use consistent 24px padding within dashboard cards.
- **Rhythm:** All spacing must be multiples of 8px. Use 48px or 64px gaps between major sections to maintain a "breathable" UI.

## Elevation & Depth

This design system uses **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, professional aesthetic.

- **Surfaces:** Use slightly darker shades of the Cream background (#F2EBD9) to define container areas.
- **Outlines:** Primary containers and cards use a 1px border in a muted version of the primary green at 10% opacity.
- **Shadows:** Reserved strictly for "Floating" elements like dropdowns or modals. Use a very soft, diffused shadow: `0px 10px 30px rgba(27, 73, 44, 0.08)`.

## Shapes

The shape language is **Soft and Architectural**. 

- **Standard Elements:** Buttons and input fields use a 0.25rem (4px) radius, reflecting a structured, professional medical environment.
- **Luxury Elements:** Jewelry cards and decorative imagery may use a larger 0.75rem (12px) radius or even organic, arched tops to mimic cathedral windows.
- **Interactive States:** Maintain sharp precision; avoid overly rounded "bubbly" shapes to keep the professional tone.

## Components

### Buttons
- **Primary:** Solid Dark Green (#1b492c) with white text. High-contrast and authoritative.
- **Secondary:** Outlined Ochre Gold (#d2ae5a) with Gold text. Used for "Add to Cart" or secondary actions.
- **Text:** Dark Grey with an underline on hover. Used for navigation and "Learn More" links.

### Jewelry Cards
- Background: Pure White or very light Cream.
- Border: 1px subtle gold outline.
- Typography: Product titles in Playfair Display (Headline-sm); prices in Inter (Label-md).
- Imagery: High-resolution, warm-lit photography with soft natural shadows.

### Admin Dashboard
- **Sidebar:** Dark Green background with Ochre Gold active states.
- **Data Tables:** Clean Inter typography, 12px font size for data, with subtle Cream row striping.
- **Status Indicators:** Use muted green (Success), ochre (Pending), and a soft terracotta (Alert) to maintain the color harmony.

### Inputs & Forms
- Focus state: 2px border in Primary Green.
- Background: #FFFFFF.
- Label: Inter Semi-bold, 12px, 8px above the input field.
---
name: Emerald Serenity
colors:
  surface: '#f9faf7'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#edeeec'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#404945'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#707975'
  outline-variant: '#c0c8c4'
  surface-tint: '#37675a'
  primary: '#002920'
  on-primary: '#ffffff'
  primary-container: '#0b4035'
  on-primary-container: '#7bac9d'
  inverse-primary: '#9fd1c1'
  secondary: '#286959'
  on-secondary: '#ffffff'
  secondary-container: '#aef0dc'
  on-secondary-container: '#2f6f5f'
  tertiary: '#2e2100'
  on-tertiary: '#ffffff'
  tertiary-container: '#483500'
  on-tertiary-container: '#c19d46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#baeddd'
  primary-fixed-dim: '#9fd1c1'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#1e4f43'
  secondary-fixed: '#aef0dc'
  secondary-fixed-dim: '#93d3c0'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#045142'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#e9c266'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#f9faf7'
  on-background: '#191c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
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
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style
The design system embodies a "Medical Premium" aesthetic, blending the rigorous authority of a private clinic with the restorative atmosphere of a high-end wellness retreat. The visual narrative is anchored in **Sophisticated Modernism**—utilizing generous whitespace, an editorial layout approach, and a focus on architectural precision.

The emotional response should be one of immediate trust, clinical excellence, and personal sanctuary. We avoid transient digital trends (like heavy glassmorphism or vibrant gradients) in favor of timeless, structural elegance. The 60% medical focus is represented by structured grids and clear information hierarchy, while the 40% premium/wellness aspect is expressed through organic transitions and a warm, ivory-tinged color palette.

## Colors
The palette is rooted in nature and clinical cleanliness. **Deep Emerald** serves as the primary anchor, conveying stability and institutional depth. **Rich Medical Green** and **Deep Teal** provide tonal variety for interactive elements and supportive surfaces.

**Warm Ivory** replaces pure white for large background areas to soften the clinical edge and inject a sense of premium hospitality. **Medical Blue** and **Soft Blue** are reserved for functional UI contexts, such as data tables, alerts, or secondary background sections. **Premium Gold** must be used sparingly as an accent—reserved for "high-touch" elements like gold-foiled dividers, bespoke iconography, or specialty calls to action.

## Typography
This system utilizes a high-contrast typographic pairing to balance heritage with modernity. 

**Libre Caslon Text** (representative of elegant editorial serifs) is used for all headlines to establish an authoritative, academic, and premium voice. For display sizes, tighter letter spacing is encouraged to emphasize the editorial feel.

**Manrope** provides a highly legible, clean, and functional counterpoint for all body copy, UI elements, and data. Labels and utility text should utilize Manrope with increased letter spacing and semi-bold weights to maintain clarity within a medical context.

## Layout & Spacing
The layout follows a **12-column fixed grid** for desktop, prioritizing wide margins to create a "gallery" feel. On mobile, we shift to a 4-column fluid grid.

The spacing rhythm is intentional and generous. Large `section-gap` values are used between major content blocks to prevent visual clutter and promote a calm user experience. Use "asymmetric balance" where text blocks may occupy 5-6 columns, leaving the remaining space for architectural photography or negative space. Organic curved transitions (subtle waves or large-radius arc separators) should be used to break horizontal sections, softening the rigid medical grid.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** rather than heavy shadows. We use subtle shifts in background color (e.g., placing a White card on a Warm Ivory surface) to indicate hierarchy.

Where elevation is strictly necessary for interactivity (like floating action buttons or dropdowns), use **Ambient Shadows**: ultra-soft, low-opacity (#0B4035 at 4-8% opacity) with a large blur radius (20-40px). This creates a "lifted" effect without breaking the clean, flat aesthetic. Avoid any inner shadows or bevels.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. This provides enough curvature to feel approachable and wellness-oriented without appearing "bubbly" or unprofessional. 

- Standard components (Inputs, Buttons): 4px (`rounded-sm`).
- Cards and Containers: 8px (`rounded-lg`).
- Image Containers: Use larger 24px (`rounded-xl`) or asymmetric rounding (e.g., top-left and bottom-right only) to mimic high-end architectural lines.
- Organic elements: Circular shapes are reserved exclusively for avatars or specific decorative "Wellness" medallions.

## Components
- **Buttons**: Primary buttons are solid Deep Emerald with White text. Secondary buttons use a Rich Medical Green outline with a 1px stroke. Label text is always uppercase Manrope.
- **Input Fields**: Ghost-style with a subtle bottom border or 1px Soft Blue stroke. Focus states should transition to a Deep Emerald border with no "glow."
- **Cards**: Minimalist. Use Warm Ivory backgrounds on White pages (or vice versa). No heavy borders; use 1px Soft Blue outlines for definition.
- **Chips/Badges**: Small, high-contrast pills (Deep Teal background) for medical categories; Soft Blue for secondary tags.
- **Dividers**: Use "Premium Gold" horizontal rules (1px, 40% width, centered) to separate major editorial sections.
- **Imagery**: All photography must be professional, featuring high-key lighting, soft focus backgrounds, and a cohesive "Emerald/Ivory" color grade. Architectural shots of the clinic should emphasize clean lines and natural light.
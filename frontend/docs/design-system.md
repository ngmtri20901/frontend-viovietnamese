# VioVietnamese Design System

A Duolingo-inspired design system featuring playful, rounded, and bright aesthetics with pink (#f40076) as the primary color.

## Design Philosophy

### Core Principles
1. **Playful & Friendly** - Learning should feel fun and approachable
2. **Rounded & Soft** - Generous border radius creates a welcoming feel
3. **Bright & Cheerful** - Vibrant colors that energize and motivate
4. **Clear Hierarchy** - Strong visual contrast guides user attention
5. **Delightful Interactions** - Smooth animations and satisfying feedback

### Visual Characteristics
- **Border Radius**: Generous roundness (12px-24px) for major elements
- **Shadows**: Prominent shadows with colored tints for depth
- **Colors**: High contrast, vibrant, and emotionally engaging
- **Typography**: Bold headings, clear readable body text
- **Spacing**: Generous padding for breathing room
- **Animations**: Bouncy, spring-based transitions

## Color System

### Primary Colors
```css
--primary: #f40076           /* Vibrant Pink - Main brand color */
--primary-hover: #d1006a      /* Darker pink for hover states */
--primary-light: #ff3399      /* Lighter pink for backgrounds */
--primary-foreground: #ffffff /* White text on primary */
```

### Secondary Colors
```css
--secondary: #B880FF         /* Purple - Premium, special features */
--secondary-hover: #9966e6    /* Darker purple for hover */
--secondary-light: #e6d9ff    /* Light purple backgrounds */

--accent: #F9C449            /* Golden Yellow - Highlights, rewards */
--accent-hover: #e0ac30       /* Darker yellow for hover */
--accent-light: #fef3d9       /* Light yellow backgrounds */
```

### Semantic Colors
```css
--success: #58cc02           /* Green - Correct answers, achievements */
--warning: #F9C449           /* Yellow - Warnings, attention */
--error: #ff4b4b             /* Red - Errors, mistakes */
--info: #1cb0f6              /* Blue - Information, tips */
```

### Neutral Colors
```css
--background: #ffffff         /* Main background */
--surface: #f7f7f7           /* Card backgrounds */
--border: #e5e5e5            /* Default borders */
--text: #3c3c3c              /* Body text */
--text-light: #777777        /* Secondary text */
--text-lighter: #afafaf      /* Disabled text */
```

## Typography

### Font Families
```css
--font-primary: 'DIN Round', 'Nunito', 'Quicksand', system-ui, sans-serif;
--font-heading: 'DIN Round', 'Nunito', 'Quicksand', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 2rem      /* 32px */
--text-4xl: 2.5rem    /* 40px */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

## Spacing System

### Scale (Tailwind-compatible)
```css
--spacing-0: 0
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-5: 1.25rem   /* 20px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-10: 2.5rem   /* 40px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
```

## Border Radius

### Scale
```css
--radius-sm: 8px      /* Small elements: badges, tags */
--radius-md: 12px     /* Default: inputs, small buttons */
--radius-lg: 16px     /* Large: buttons, cards */
--radius-xl: 20px     /* Extra large: prominent cards */
--radius-2xl: 24px    /* Jumbo: hero cards, modals */
--radius-full: 9999px /* Pills, circular avatars */
```

## Shadows

### Shadow System
```css
/* Soft shadows with pink tint */
--shadow-sm: 0 2px 4px rgba(244, 0, 118, 0.08);
--shadow-md: 0 4px 8px rgba(244, 0, 118, 0.12);
--shadow-lg: 0 8px 16px rgba(244, 0, 118, 0.16);
--shadow-xl: 0 12px 24px rgba(244, 0, 118, 0.2);

/* Bottom-heavy shadows (Duolingo style) */
--shadow-bottom-sm: 0 4px 0 rgba(0, 0, 0, 0.1);
--shadow-bottom-md: 0 6px 0 rgba(0, 0, 0, 0.15);
--shadow-bottom-lg: 0 8px 0 rgba(0, 0, 0, 0.2);

/* Colored shadows for interactive elements */
--shadow-primary: 0 6px 0 #d1006a;
--shadow-secondary: 0 6px 0 #4bb601;
--shadow-accent: 0 6px 0 #e6b500;
```

## Animation

### Timing Functions
```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
```

### Durations
```css
--duration-fast: 150ms
--duration-normal: 250ms
--duration-slow: 350ms
```

### Common Animations
- **Hover Scale**: Scale up by 1.05 with bounce easing
- **Press Scale**: Scale down to 0.95 instantly
- **Fade In**: Opacity 0 to 1 with smooth easing
- **Slide In**: translateY with bounce easing
- **Pulse**: Scale 1 to 1.1 and back, repeating

## Component Specifications

### Button

#### Primary Button
- Background: `--primary` with `--shadow-primary`
- Border Radius: `--radius-lg` (16px)
- Padding: 16px 32px
- Font: Bold, uppercase for CTAs
- Hover: Translate up 2px, brighten shadow
- Active: Translate down to remove shadow

#### Secondary Button
- Similar to primary but with `--secondary` colors
- Used for affirmative secondary actions

#### Ghost Button
- Transparent background
- Border: 3px solid with current color
- Hover: Fill with light tint of border color

### Card

#### Standard Card
- Background: White
- Border Radius: `--radius-xl` (20px)
- Border: 3px solid `--border`
- Shadow: `--shadow-md`
- Padding: 24px
- Hover: Lift up with `--shadow-lg`

#### Interactive Card
- Add bottom shadow: `--shadow-bottom-md`
- Active state: Compress shadow on click
- Cursor: pointer

### Input

#### Text Input
- Border Radius: `--radius-md` (12px)
- Border: 3px solid `--border`
- Padding: 12px 16px
- Focus: Border color changes to `--primary`, add focus ring
- Font Size: `--text-base`

### Slider

#### Track
- Height: 12px
- Border Radius: `--radius-full`
- Background: Light gray
- Active Range: `--primary` gradient

#### Thumb
- Size: 28px circle
- Border: 4px solid white
- Box Shadow: `--shadow-md`
- Background: `--primary`
- Hover: Scale to 1.15

### Progress Bar

#### Bar
- Height: 16px
- Border Radius: `--radius-full`
- Background: Light gray
- Border: 2px solid `--border`

#### Indicator
- Background: Gradient from `--primary` to `--primary-light`
- Border Radius: `--radius-full`
- Animated transition

## Usage Guidelines

### When to Use Primary Color
- Primary CTAs (Start lesson, Continue, Submit)
- Active states and selections
- Brand elements and logos
- Progress indicators for main goals

### When to Use Secondary Color
- Premium features and content
- Special highlights
- Important secondary actions
- Tier upgrades or pro features

### When to Use Accent Color
- Rewards and streaks
- Achievements and badges
- Attention-grabbing elements
- Limited-time offers

### Accessibility

#### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal text)
- Primary pink on white: 6.2:1 ✓
- White on primary pink: 6.2:1 ✓

#### Interactive Elements
- Minimum touch target: 44x44px
- Visible focus states for keyboard navigation
- Clear hover states for mouse users
- Sufficient spacing between interactive elements

#### Motion
- Respect `prefers-reduced-motion` media query
- Provide static alternatives for animations
- Keep animations under 500ms

## Design Tokens Reference

All design tokens are defined in [globals.css](../app/globals.css) as CSS custom properties for easy theming and consistency across the application.

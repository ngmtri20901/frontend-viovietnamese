# 🎨 Color Reference Guide - Centralized Color Management

This guide shows you how to manage colors in the VioVietnamese design system. **All colors are now centralized in one place** - you only need to update `globals.css`!

## 🌟 The Easy Way: Change Colors in One Place

### Step 1: Open `frontend/app/globals.css`

All design system colors are defined as CSS variables in the `:root` selector. This is the **ONLY file** you need to edit to change colors throughout your entire application.

### Step 2: Update the Color Values

Find the section that looks like this (around line 47-87):

```css
:root {
  /* ============================================= */
  /* DESIGN SYSTEM COLORS - Duolingo Inspired     */
  /* ============================================= */

  /* Primary - Vibrant Pink */
  --ds-primary: #f40076;
  --ds-primary-hover: #ff1a8a;
  --ds-primary-active: #d1006a;
  --ds-primary-light: #ff3399;
  --ds-primary-foreground: #ffffff;

  /* Secondary - Purple */
  --ds-secondary: #B880FF;
  --ds-secondary-hover: #c799ff;
  --ds-secondary-active: #9966e6;
  --ds-secondary-light: #e6d9ff;
  --ds-secondary-foreground: #ffffff;

  /* Accent - Golden Yellow */
  --ds-accent: #F9C449;
  --ds-accent-hover: #fad066;
  --ds-accent-active: #e0ac30;
  --ds-accent-light: #fef3d9;
  --ds-accent-foreground: #1f2937;

  /* Semantic Colors */
  --ds-success: #58cc02;
  --ds-success-light: #d7ffb8;
  --ds-error: #ff4b4b;
  --ds-error-active: #e63c3c;
  --ds-warning: #F9C449;
  --ds-info: #1cb0f6;

  /* Neutral Colors */
  --ds-background: #ffffff;
  --ds-foreground: #3c3c3c;
  --ds-surface: #f7f7f7;
  --ds-border: #e5e5e5;
  --ds-text: #3c3c3c;
  --ds-text-light: #777777;
  --ds-text-lighter: #afafaf;
}
```

### Step 3: Change the Hex Values

Simply replace the hex color values with your new colors. That's it! All components will automatically update.

---

## 🎨 Current Color Palette

| Color Category | Variable Name | Current Value | Usage |
|----------------|---------------|---------------|-------|
| **Primary** | `--ds-primary` | `#f40076` | Main brand color, primary buttons, links |
| | `--ds-primary-hover` | `#ff1a8a` | Hover state for primary elements |
| | `--ds-primary-active` | `#d1006a` | Active/pressed state, shadows |
| | `--ds-primary-light` | `#ff3399` | Gradients, light backgrounds |
| | `--ds-primary-foreground` | `#ffffff` | Text on primary backgrounds |
| **Secondary** | `--ds-secondary` | `#B880FF` | Secondary actions, premium features |
| | `--ds-secondary-hover` | `#c799ff` | Hover state |
| | `--ds-secondary-active` | `#9966e6` | Active state, shadows |
| | `--ds-secondary-light` | `#e6d9ff` | Light backgrounds |
| | `--ds-secondary-foreground` | `#ffffff` | Text on secondary backgrounds |
| **Accent** | `--ds-accent` | `#F9C449` | Highlights, rewards, attention |
| | `--ds-accent-hover` | `#fad066` | Hover state |
| | `--ds-accent-active` | `#e0ac30` | Active state, shadows |
| | `--ds-accent-light` | `#fef3d9` | Light backgrounds |
| | `--ds-accent-foreground` | `#1f2937` | Text on accent backgrounds |
| **Semantic** | `--ds-success` | `#58cc02` | Success messages, correct answers |
| | `--ds-error` | `#ff4b4b` | Errors, invalid states |
| | `--ds-warning` | `#F9C449` | Warnings, cautions |
| | `--ds-info` | `#1cb0f6` | Information, tips |

---

## 📝 How Components Use These Colors

All components have been refactored to use Tailwind utility classes that reference these CSS variables:

### Button Component
```typescript
// Instead of: bg-[#f40076]
// Now uses:    bg-ds-primary

default: [
  "bg-ds-primary text-ds-primary-foreground",
  "hover:bg-ds-primary-hover",
  "active:shadow-[0_2px_0_0_var(--ds-primary-active)]",
]
```

### Card Component
```typescript
// Instead of: border-[#f40076]
// Now uses:    border-ds-primary

highlighted: [
  "border-ds-primary",
  "shadow-[0_4px_8px_color-mix(in_srgb,var(--ds-primary)_20%,transparent)]",
]
```

### Input Component
```typescript
// Instead of: focus:border-[#f40076]
// Now uses:    focus:border-ds-primary

"selection:bg-ds-primary",
"focus:border-ds-primary focus:ring-ds-primary/20",
```

### Slider & Progress
```typescript
// Instead of: from-[#f40076] to-[#ff3399]
// Now uses:    from-ds-primary to-ds-primary-light

"bg-gradient-to-r from-ds-primary to-ds-primary-light"
```

---

## 🔧 Example: Changing the Secondary Color

Let's say you want to change secondary from **#B880FF (purple)** to **#00D4AA (teal)**.

### Before (Old Way - 50+ changes in multiple files):
❌ Edit button.tsx
❌ Edit card.tsx
❌ Edit design-system/page.tsx
❌ Edit design-system.md
❌ ...and many more files

### After (New Way - 1 change in 1 file):
✅ **Only edit `frontend/app/globals.css`**

**Just change these lines:**

```css
:root {
  /* Secondary - Teal (changed from Purple) */
  --ds-secondary: #00D4AA;           /* Changed */
  --ds-secondary-hover: #1ae0b8;     /* Lighter teal */
  --ds-secondary-active: #00b38f;    /* Darker teal */
  --ds-secondary-light: #ccf5ed;     /* Very light teal */
  --ds-secondary-foreground: #ffffff; /* Unchanged */
}
```

**That's it!** All buttons, cards, and components using secondary color will automatically update throughout your entire application.

---

## 🎨 Creating Color Variations

When updating a color, you typically need to create these variations:

### Base Color
The main color you want to use.
Example: `#B880FF`

### Hover State (10-15% lighter)
For hover effects - slightly brighter than base.
- **Quick method**: Use [ColorHexa](https://www.colorhexa.com/) - enter your color and look at "Lighter" shades
- **Manual**: Increase HSL lightness by 10-15%
Example: `#c799ff`

### Active State (10-15% darker)
For pressed/active states and shadows - darker than base.
- **Quick method**: Use [ColorHexa](https://www.colorhexa.com/) - look at "Darker" shades
- **Manual**: Decrease HSL lightness by 10-15%
Example: `#9966e6`

### Light Background (20-30% opacity)
For light backgrounds and tinted areas.
- **Quick method**: Use color picker to create very light tint
- **Manual**: HSL with very high lightness (85-95%)
Example: `#e6d9ff`

### Foreground/Text Color
Text that appears on top of the color.
- **White (`#ffffff`)** for dark/saturated backgrounds
- **Dark gray/black** for light/pastel backgrounds
Example: `#ffffff`

---

## 🛠️ Tools to Help Create Color Palettes

### Recommended Tools:
1. **[ColorHexa](https://www.colorhexa.com/)** - Best for creating lighter/darker shades
2. **[Coolors](https://coolors.co/)** - Great for generating full palettes
3. **[Adobe Color](https://color.adobe.com/)** - Professional color wheel tool
4. **[Paletton](https://paletton.com/)** - Comprehensive palette generator

### How to Use ColorHexa:
1. Go to https://www.colorhexa.com/
2. Enter your hex color (e.g., `B880FF`)
3. Scroll down to see:
   - **Lighter shades** → Use for hover states
   - **Darker shades** → Use for active states
   - **Tints** → Use for light backgrounds

---

## ✅ Quick Checklist for Changing Colors

When you want to change a color:

- [x] Open `frontend/app/globals.css`
- [x] Find the color variable you want to change (e.g., `--ds-primary`)
- [x] Update the hex value
- [x] Update related variations (hover, active, light)
- [x] Save the file
- [x] Refresh your browser

**Done!** No need to touch any component files.

---

## 📍 Where Are Colors Defined?

### Single Source of Truth
**File**: `frontend/app/globals.css`
**Lines**: 47-87 (`:root` section)

This is the **ONLY** place where design system colors are defined.

### How Tailwind Knows About These Colors

In the same file, the `@theme inline` section (lines 6-70) maps these CSS variables to Tailwind utility classes:

```css
@theme inline {
  --color-ds-primary: var(--ds-primary);
  --color-ds-secondary: var(--ds-secondary);
  --color-ds-accent: var(--ds-accent);
  /* ... etc */
}
```

This allows you to use `bg-ds-primary`, `text-ds-secondary`, `border-ds-accent` in your components.

---

## 🎯 Benefits of This Approach

### Before (Hardcoded Colors)
- ❌ Change colors in 50+ places
- ❌ Easy to miss a spot
- ❌ Inconsistent colors across app
- ❌ Hard to maintain
- ❌ No dark mode support

### After (CSS Variables)
- ✅ Change colors in **1 place**
- ✅ Guaranteed consistency
- ✅ Easy to maintain
- ✅ Future-proof for dark mode
- ✅ Components update automatically

---

## 🌙 Future: Dark Mode Support

With CSS variables, adding dark mode is simple. Just add a `.dark` class with different values:

```css
:root {
  --ds-primary: #f40076;  /* Light mode */
}

.dark {
  --ds-primary: #ff3399;  /* Dark mode - lighter pink */
}
```

All components automatically support both themes!

---

## 🚀 Advanced: Using Colors in Custom Components

When creating new components, use the Tailwind classes that reference our design system colors:

### Background Colors
```tsx
className="bg-ds-primary"         // Primary background
className="bg-ds-secondary"       // Secondary background
className="bg-ds-accent"          // Accent background
```

### Text Colors
```tsx
className="text-ds-primary"       // Primary text
className="text-ds-secondary"     // Secondary text
className="text-ds-error"         // Error text
```

### Border Colors
```tsx
className="border-ds-primary"     // Primary border
className="border-ds-accent"      // Accent border
```

### Hover States
```tsx
className="hover:bg-ds-primary-hover"   // Hover background
className="hover:text-ds-primary-hover" // Hover text
```

### Direct CSS Variable Access
For advanced cases (like gradients or shadows), use `var()`:

```tsx
style={{
  background: `linear-gradient(to right, var(--ds-primary), var(--ds-primary-light))`
}}

// Or in Tailwind arbitrary values:
className="shadow-[0_4px_8px_var(--ds-primary)]"
```

---

## 🔗 Related Documentation

- **Design System Overview**: [design-system.md](./design-system.md)
- **Migration Plan**: [design-migration-plan.md](./design-migration-plan.md)
- **Preview All Components**: Visit `/design-system` in your app

---

## 💡 Pro Tips

### Tip 1: Test Your Colors
After changing colors, visit `/design-system` to see all components with the new colors.

### Tip 2: Maintain Contrast
Ensure text colors have sufficient contrast with backgrounds (WCAG AA: 4.5:1 minimum).

### Tip 3: Keep it Simple
Don't create too many color variations. Stick to the pattern:
- Base color
- Hover (lighter)
- Active (darker)
- Light background
- Foreground/text

### Tip 4: Document Your Changes
When changing colors, update the comments in `globals.css` to explain the new color's purpose.

---

## ❓ FAQ

**Q: I changed the color in globals.css but don't see changes. Why?**
A: Make sure to save the file and hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R).

**Q: Can I add new colors?**
A: Yes! Just add them to `:root` in `globals.css` and to `@theme inline` section:
```css
:root {
  --ds-my-new-color: #abc123;
}

@theme inline {
  --color-ds-my-new-color: var(--ds-my-new-color);
}
```
Then use `bg-ds-my-new-color` in components.

**Q: What if I need a one-off color that's not in the design system?**
A: Use Tailwind's arbitrary value syntax: `bg-[#abc123]` - but prefer design system colors for consistency.

**Q: How do I create gradients?**
A: Use: `bg-gradient-to-r from-ds-primary to-ds-primary-light`

**Q: Can I still use the old hardcoded hex colors?**
A: Yes, Tailwind's arbitrary values still work (`bg-[#f40076]`), but it's better to use design system variables for consistency and maintainability.

---

## 🎉 Summary

### ✨ The Golden Rule

> **To change any design system color, edit ONE file: `frontend/app/globals.css`**

No more hunting through dozens of component files. No more missed updates. Just change the color once, and watch your entire design system update automatically.

Happy designing! 🎨

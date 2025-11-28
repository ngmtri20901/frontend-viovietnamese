# Design System Migration Plan

This document outlines the step-by-step plan to migrate VioVietnamese to a Duolingo-inspired design system with playful, rounded aesthetics and pink (#f40076) as the primary color.

## Overview

**Goal**: Transform the current UI into a vibrant, playful, and engaging experience that makes learning Vietnamese fun and motivating.

**Timeline**: Phased rollout to minimize disruption
**Primary Color**: #f40076 (Vibrant Pink)
**Design Inspiration**: Duolingo (playful, rounded, bright)

## Phase 1: Foundation Setup ✅

### 1.1 Design Token Definition
- [x] Document design system principles
- [x] Define color palette (primary, secondary, semantic, neutral)
- [x] Establish typography scale and fonts
- [x] Create spacing system
- [x] Define border radius scale
- [x] Create shadow system
- [x] Define animation tokens

**Deliverable**: [design-system.md](./design-system.md)

### 1.2 CSS Variables Update
- [ ] Update `globals.css` with new design tokens
- [ ] Replace current color variables with new palette
- [ ] Add shadow variables
- [ ] Add animation timing functions
- [ ] Add border radius scale
- [ ] Ensure dark mode compatibility

**Files to Update**:
- `app/globals.css`

### 1.3 Tailwind Configuration
- [ ] Extend Tailwind theme with custom colors
- [ ] Add custom border radius values
- [ ] Configure custom shadows
- [ ] Add custom animation utilities
- [ ] Set up font families

**Files to Update**:
- `tailwind.config.ts` (needs to be created/found)

## Phase 2: Core Component Redesign 🎨

### 2.1 Button Component
**Priority**: High (Most used component)

**Current State**:
- Standard shadcn/ui button
- Minimal rounded corners (rounded-md)
- Subtle shadows
- Muted colors

**Target Design**:
- Bold, chunky appearance
- Large border radius (16px)
- Bottom-heavy shadows (Duolingo style)
- Vibrant pink primary variant
- Green secondary variant
- Yellow accent variant
- Hover: Lift animation + shadow expansion
- Active: Press down animation

**Implementation Tasks**:
- [ ] Update `buttonVariants` CVA config
- [ ] Add new variant types (primary, secondary, accent)
- [ ] Implement bottom shadow system
- [ ] Add hover/active animations
- [ ] Add pressed state with transform
- [ ] Ensure accessibility (focus rings, touch targets)

**Files to Update**:
- `shared/components/ui/button.tsx`

### 2.2 Card Component
**Priority**: High (Used throughout app)

**Current State**:
- Simple rounded corners (rounded-xl)
- Minimal shadow
- Border-based design

**Target Design**:
- Generous border radius (20px)
- Thick borders (3px)
- Prominent shadows with pink tint
- Hover lift effect
- Interactive cards with bottom shadow
- Optional colored borders for different contexts

**Implementation Tasks**:
- [ ] Increase border radius to 20px
- [ ] Add thick border (3px)
- [ ] Implement shadow system with tints
- [ ] Add hover states for interactive cards
- [ ] Create variant system (default, interactive, highlighted)
- [ ] Update all sub-components (Header, Content, Footer)

**Files to Update**:
- `shared/components/ui/card.tsx`

### 2.3 Input Component
**Priority**: High (Forms throughout app)

**Current State**:
- Rounded corners (rounded-md)
- Thin border
- Standard focus ring

**Target Design**:
- Medium border radius (12px)
- Thick border (3px)
- Larger padding (12px 16px)
- Pink focus ring with border color change
- Larger font size
- Playful error states with shake animation

**Implementation Tasks**:
- [ ] Increase border thickness to 3px
- [ ] Update border radius to 12px
- [ ] Enhance focus state with pink accent
- [ ] Add error state animations
- [ ] Increase padding for better touch targets
- [ ] Update placeholder styling

**Files to Update**:
- `shared/components/ui/input.tsx`

### 2.4 Slider Component
**Priority**: Medium

**Current State**:
- Thin track (1.5px)
- Small thumb (4px)
- Minimal styling

**Target Design**:
- Thick track (12px)
- Large, chunky thumb (28px)
- Pink gradient on active range
- Prominent shadow on thumb
- Hover scale effect on thumb
- Smooth, bouncy animations

**Implementation Tasks**:
- [ ] Increase track height to 12px
- [ ] Increase thumb size to 28px
- [ ] Add gradient to range
- [ ] Add shadow to thumb
- [ ] Implement hover scale animation
- [ ] Add white border to thumb for contrast

**Files to Update**:
- `shared/components/ui/slider.tsx`

### 2.5 Progress Component
**Priority**: Medium (Important for learning feedback)

**Current State**:
- Thin bar (2px)
- Simple background color

**Target Design**:
- Thicker bar (16px)
- Rounded ends (full radius)
- Gradient fill (pink to lighter pink)
- Border around track
- Animated transitions
- Optional: Percentage display, celebration animation at 100%

**Implementation Tasks**:
- [ ] Increase height to 16px
- [ ] Add border to track
- [ ] Implement gradient on indicator
- [ ] Add smooth transition animations
- [ ] Consider adding percentage overlay
- [ ] Add completion celebration effect

**Files to Update**:
- `shared/components/ui/progress.tsx`

## Phase 3: Extended Components 🧩

### 3.1 Badge Component
- [ ] Add vibrant color variants
- [ ] Increase border radius
- [ ] Add subtle shadows
- [ ] Make more prominent

### 3.2 Alert/Toast Component
- [ ] Add colored left border (thick)
- [ ] Use semantic colors (success, error, warning, info)
- [ ] Add icon support with color matching
- [ ] Implement slide-in animations

### 3.3 Dialog/Modal Component
- [ ] Increase border radius (24px)
- [ ] Add prominent shadows
- [ ] Update backdrop styling
- [ ] Improve animations (bounce in)

### 3.4 Checkbox & Radio Components
- [ ] Larger size with thick borders
- [ ] Pink check/radio fill
- [ ] Bouncy check animation
- [ ] Better focus indicators

### 3.5 Select & Dropdown Components
- [ ] Match input styling (thick border, rounded)
- [ ] Animate dropdown appearance
- [ ] Style options with hover states
- [ ] Add pink highlights for selected items

## Phase 4: Custom Component Updates 🎯

### 4.1 CTA Cards
**Current Classes**: `.cta-card`, `.cta-card-horizontal`

**Updates Needed**:
- [ ] Apply new border radius (20px)
- [ ] Add bottom shadows
- [ ] Update hover effects (lift animation)
- [ ] Use new color palette
- [ ] Update button styling within cards

**Files to Update**:
- `app/globals.css` (CTA Card Styles section)

### 4.2 Voice Chat Components
**Components**: Waveform, Volume Bar, Transcript Panel, Call Cards

**Updates Needed**:
- [ ] Update card styling for voice chat interface
- [ ] Apply new color palette to status indicators
- [ ] Update button variants (btn-call, btn-disconnect)
- [ ] Enhance animations with new timing functions
- [ ] Update transcript bubble styling

**Files to Update**:
- `app/globals.css` (Voice Chat section)
- `features/ai/voice/components/*`

## Phase 5: Design System Preview Page 📱

### 5.1 Create Preview Page
**Path**: `app/(public)/design-system/page.tsx`

**Sections to Include**:
1. **Colors**
   - Primary, Secondary, Accent color swatches
   - Semantic colors (success, warning, error, info)
   - Neutral colors
   - Background colors

2. **Typography**
   - Heading scales (h1-h6)
   - Body text sizes
   - Font weights
   - Line heights

3. **Buttons**
   - All variants (primary, secondary, accent, ghost, outline)
   - All sizes (sm, md, lg, icon)
   - States (default, hover, active, disabled)

4. **Cards**
   - Standard card
   - Interactive card
   - Card with all sub-components
   - Variant examples

5. **Form Elements**
   - Inputs (text, email, password, search)
   - Input states (default, focus, error, disabled)
   - Slider (various configurations)
   - Checkbox & Radio
   - Select dropdowns

6. **Feedback Components**
   - Progress bars (various percentages)
   - Badges
   - Alerts/Toasts
   - Loading states

7. **Spacing & Layout**
   - Spacing scale visualization
   - Border radius examples
   - Shadow examples

**Implementation Tasks**:
- [ ] Create page component
- [ ] Build color palette section
- [ ] Build typography showcase
- [ ] Build component showcase for each redesigned component
- [ ] Add interactive examples (hover, click states)
- [ ] Add code snippets for developers
- [ ] Make it responsive

## Phase 6: Global Styles Update 🌐

### 6.1 Update Base Styles
- [ ] Apply new font families
- [ ] Update base text colors
- [ ] Apply new background colors
- [ ] Update border and shadow defaults

### 6.2 Custom Animations
- [ ] Create bounce animation
- [ ] Create lift animation
- [ ] Create press animation
- [ ] Create shake animation (for errors)
- [ ] Create celebration animation (for success)

**Add to**: `app/globals.css`

## Phase 7: Testing & Refinement 🧪

### 7.1 Visual Testing
- [ ] Test all components in isolation
- [ ] Test components in realistic page contexts
- [ ] Check responsive behavior
- [ ] Verify dark mode (if applicable)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### 7.2 Accessibility Testing
- [ ] Verify color contrast ratios
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify focus indicators
- [ ] Test touch targets (min 44x44px)
- [ ] Test with prefers-reduced-motion

### 7.3 Performance Testing
- [ ] Measure animation performance
- [ ] Check for layout shifts
- [ ] Verify smooth 60fps animations
- [ ] Optimize shadow rendering

## Phase 8: Documentation & Rollout 📚

### 8.1 Developer Documentation
- [ ] Update component documentation
- [ ] Add usage examples
- [ ] Document do's and don'ts
- [ ] Create migration guide for existing code
- [ ] Add Storybook/design system site

### 8.2 Gradual Rollout
- [ ] Roll out to design system preview page first
- [ ] Update one feature at a time (e.g., voice chat first)
- [ ] Gather user feedback
- [ ] Make adjustments as needed
- [ ] Roll out to all pages

### 8.3 Training & Communication
- [ ] Share design system documentation with team
- [ ] Create design guidelines for new features
- [ ] Establish component review process

## Checklist Summary

### Immediate (Phase 1-2)
- [ ] Update CSS variables in globals.css
- [ ] Configure Tailwind theme
- [ ] Redesign Button component
- [ ] Redesign Card component
- [ ] Redesign Input component
- [ ] Create design-system preview page

### Short-term (Phase 3-4)
- [ ] Redesign Slider component
- [ ] Redesign Progress component
- [ ] Update Badge, Alert, Dialog components
- [ ] Update CTA cards styling
- [ ] Update Voice chat components

### Long-term (Phase 5-8)
- [ ] Complete all extended components
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Gradual rollout
- [ ] Team training

## Success Metrics

- **User Engagement**: Increased time on site, more lessons completed
- **User Feedback**: Positive sentiment about new design
- **Accessibility Score**: Maintain or improve WCAG AA compliance
- **Performance**: No degradation in page load or animation performance
- **Developer Velocity**: Faster component development with clear system

## Risk Mitigation

### Risk: Breaking existing pages
**Mitigation**:
- Use CSS custom properties for easy rollback
- Maintain backward compatibility during transition
- Test thoroughly before rollout

### Risk: Accessibility regressions
**Mitigation**:
- Automated accessibility testing in CI/CD
- Manual testing with assistive technologies
- Maintain WCAG AA standards throughout

### Risk: Performance issues
**Mitigation**:
- Use CSS transforms for animations (GPU-accelerated)
- Optimize shadow rendering
- Test on low-end devices
- Respect prefers-reduced-motion

## Notes

- All color values should use CSS custom properties for easy theming
- Components should remain compatible with shadcn/ui architecture
- Maintain component API stability when possible
- Prioritize mobile-first responsive design
- Keep bundle size in check (avoid heavy animation libraries)

## References

- [Design System Documentation](./design-system.md)
- [Duolingo Design Principles](https://design.duolingo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

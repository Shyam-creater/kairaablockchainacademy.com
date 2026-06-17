# Kairaa Academy Design System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Best Practices](#best-practices)
7. [Accessibility](#accessibility)
8. [Performance](#performance)

---

## Overview

The Kairaa Blockchain Academy Design System is a comprehensive, modern design language built with **React** and **Tailwind CSS**. It's designed to create a premium, trustworthy, and professional experience for students, instructors, and administrators.

### Key Principles
- **Clarity**: Clear visual hierarchy and messaging
- **Trust**: Professional, secure-feeling design
- **Innovation**: Modern aesthetic reflecting blockchain/Web3 industry
- **Accessibility**: WCAG AA compliant throughout
- **Performance**: Optimized for speed and efficiency

---

## Color System

### Primary Colors

**Primary Blue** - Trust & Technology
```
primary-50: #F0F5FF (lightest)
primary-500: #0066FF (main)
primary-900: #001F4D (darkest)
```
Use for: Main CTAs, links, primary actions, headers

**Secondary Cyan** - Innovation & Energy
```
secondary-50: #E0F7FF
secondary-500: #00D4FF (main)
secondary-900: #003633
```
Use for: Secondary CTAs, accents, highlights

**Accent Orange-Red** - Urgency & Energy
```
accent-50: #FFF5F0
accent-500: #FF6B35 (main)
accent-900: #661F00
```
Use for: Important alerts, special offers, emphasis

### Semantic Colors

**Success** (Green)
```
success-500: #22C55E
```
Use for: Confirmations, success states, checkmarks

**Warning** (Amber)
```
warning-500: #F59E0B
```
Use for: Cautions, important notices, ratings

**Error** (Red)
```
error-500: #EF4444
```
Use for: Errors, dangers, destructive actions

**Info** (Blue)
```
info-500: #3B82F6
```
Use for: Information, announcements, help

### Neutral Colors

```
neutral-50: #F8FAFC (almost white background)
neutral-200: #E2E8F0 (borders, light dividers)
neutral-600: #475569 (secondary text)
neutral-900: #0F172A (primary text, black)
```

### Color Usage Guidelines

```
Text:
- Primary text: neutral-900 on white/light backgrounds
- Secondary text: neutral-600 for supporting information
- Tertiary text: neutral-400 for hints/disabled states
- On colored backgrounds: Use darkest shade from same family

Backgrounds:
- Default: white (#FFFFFF)
- Surface: neutral-50 (light gray)
- Hover: Add overlay or lighter shade (e.g., primary-50)

Borders:
- Default: neutral-200 (light borders)
- Hover: neutral-300
- Focus: primary-500 (accent border on focus)
```

### Color Contrast Examples

Good ✅
```
primary-500 text on white: 9.2:1 ratio (AAA)
primary-700 text on primary-50: 7.4:1 ratio (AAA)
neutral-600 text on white: 6.1:1 ratio (AAA)
```

Avoid ❌
```
neutral-400 text on white: 5.1:1 ratio (Below AA)
Light colors on light backgrounds
```

---

## Typography

### Font Stack

```css
/* Headings & Bold Text */
font-family: 'Inter', system-ui, sans-serif;

/* Body & Regular Text */
font-family: 'Inter', system-ui, sans-serif;

/* Code & Technical Text */
font-family: 'JetBrains Mono', monospace;

/* Editorial/Quotes */
font-family: 'Georgia', serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 48px | 600 | 1.2 | Page titles |
| H2 | 36px | 600 | 1.3 | Section titles |
| H3 | 28px | 600 | 1.4 | Subsection titles |
| H4 | 24px | 600 | 1.4 | Card titles |
| H5 | 20px | 600 | 1.5 | Component headers |
| H6 | 16px | 600 | 1.5 | Small headers |
| Body Large | 18px | 400 | 1.6 | Introduction text |
| Body | 16px | 400 | 1.7 | Regular body text |
| Body Small | 14px | 400 | 1.6 | Secondary text |
| Label | 14px | 500 | 1.5 | Form labels |
| Caption | 12px | 500 | 1.5 | Hints, help text |

### Font Weights

Only 2 weights are used:
- **400 (Regular)**: Body text, regular weight
- **600 (Semibold)**: Headings, bold emphasis, labels

*Never use 700 or 800 - they look too heavy*

### Text Styling Examples

```jsx
// Heading
<h1 className="text-h1 text-neutral-900">Master Blockchain</h1>

// Body text
<p className="text-body text-neutral-700">
  Learn from industry experts...
</p>

// Small caption
<span className="text-caption text-neutral-500">
  Updated 2 hours ago
</span>

// Code/Technical
<code className="font-mono text-body-sm bg-neutral-100 px-2 py-1 rounded">
  function deploy() { }
</code>
```

---

## Spacing & Layout

### Spacing Scale

All spacing follows an 8px base unit:

```
xs: 2px     (icon spacing)
sm: 4px     (tight)
md: 8px     (base unit)
lg: 12px    (small spacing)
xl: 16px    (default padding)
2xl: 24px   (padding/margin)
3xl: 32px   (section spacing)
4xl: 48px   (large spacing)
5xl: 64px   (page-level spacing)
```

### Padding & Margin Examples

```jsx
// Small spacing
<div className="p-2 gap-2">

// Default padding
<div className="p-6 m-4">

// Large spacing
<div className="p-12 my-12">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

### Layout Containers

```jsx
// Max-width container (1400px)
<Container>
  <div>Content here</div>
</Container>

// Full-width section with padding
<Section title="Title" padding="py-20">
  <Grid columns={3}>
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
  </Grid>
</Section>
```

### Grid System

```jsx
// 3-column grid (responsive)
<Grid columns={3}>
  <Card />
  <Card />
  <Card />
</Grid>

// Custom gap
<Grid columns={3} gap="xl">
  <Card />
  <Card />
  <Card />
</Grid>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card />
</div>
```

### Breakpoints

```
xs: 320px   (mobile)
sm: 640px   (small mobile)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (ultra-wide)
```

### Responsive Patterns

```jsx
// Mobile-first (default), then override
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// Grid that stacks on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card />
</div>

// Hidden on small screens
<div className="hidden md:block">
  Desktop only content
</div>
```

---

## Components

### Button

```jsx
<Button 
  variant="primary"      // primary, secondary, tertiary, danger, success
  size="md"              // sm, md, lg
  disabled={false}
  loading={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

**Variants:**
- `primary`: Blue background, white text (main actions)
- `secondary`: White background, blue border (secondary actions)
- `tertiary`: No background, blue text (minimal actions)
- `danger`: Red background (destructive actions)
- `success`: Green background (positive confirmations)

**Sizes:**
- `sm`: 32px height (compact)
- `md`: 40px height (default)
- `lg`: 48px height (prominent)

**States:**
- Hover: Darker color
- Active: Even darker, subtle shadow
- Disabled: Gray, 50% opacity
- Loading: Shows spinner

### Input

```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required={true}
  error={errorMessage}
  helperText="We'll never share your email"
  onChange={handleChange}
/>
```

**Features:**
- Automatic focus ring (blue)
- Error state styling (red border)
- Helper text support
- Disabled state support

### Select & TextArea

```jsx
<Select
  label="Choose Course"
  options={[
    { label: 'Beginner', value: 'beginner' },
    { label: 'Advanced', value: 'advanced' },
  ]}
  required={true}
  error={errorMessage}
/>

<TextArea
  label="Message"
  rows={4}
  placeholder="Type your message..."
  error={errorMessage}
/>
```

### Card

```jsx
<Card className="p-6">
  <h3 className="text-h5 mb-2">Title</h3>
  <p className="text-body text-neutral-600">Content here</p>
</Card>
```

**Features:**
- White background with subtle border
- Hover shadow effect
- Responsive padding
- Customizable via className

### CourseCard

```jsx
<CourseCard
  image="course-image.jpg"
  badge="Beginner"
  title="Introduction to Blockchain"
  description="Learn the fundamentals..."
  price={99}
  instructor="John Doe"
  rating={4.8}
  students="2,341"
  onEnroll={handleEnroll}
/>
```

**Features:**
- Image with hover scale effect
- Badge positioning
- Truncated text (line-clamp)
- Price and enroll button

### TestimonialCard

```jsx
<TestimonialCard
  avatar="avatar.jpg"
  name="Sarah Chen"
  role="Full-Stack Developer"
  quote="Best course I've ever taken!"
  rating={5}
/>
```

### Badge & Tag

```jsx
<Badge variant="primary" size="md">
  Beginner
</Badge>

<Tag 
  label="Blockchain" 
  onRemove={() => removeTag()}
/>
```

### Forms

```jsx
<FormGroup
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      rows: 4,
      required: true,
    },
  ]}
  submitText="Submit"
  loading={false}
  onSubmit={(data, setErrors) => {
    // Handle submission
  }}
/>
```

### Table

```jsx
<Table
  columns={[
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Status', key: 'status' },
  ]}
  data={[
    { name: 'John', email: 'john@example.com', status: 'Active' },
    { name: 'Jane', email: 'jane@example.com', status: 'Inactive' },
  ]}
  actions={(row) => (
    <Button size="sm" onClick={() => editRow(row)}>Edit</Button>
  )}
/>
```

### Modal

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p className="text-body text-neutral-700">
    Are you sure you want to continue?
  </p>
</Modal>
```

### Alert

```jsx
<Alert
  variant="success"        // success, error, warning, info
  title="Success!"
  message="Your changes have been saved"
  onClose={() => {}}
/>
```

### Navbar

```jsx
<Navbar
  logo="Kairaa Academy"
  items={[
    { label: 'Home', href: '#' },
    { label: 'Courses', href: '#courses' },
    { label: 'About', href: '#about' },
  ]}
  rightContent={
    <>
      <Button variant="tertiary">Sign In</Button>
      <Button>Sign Up</Button>
    </>
  }
/>
```

**Features:**
- Sticky positioning
- Mobile hamburger menu
- Responsive design
- Logo + navigation + actions

### Footer

```jsx
<Footer
  companyName="Kairaa Academy"
  description="Empowering blockchain developers..."
  sections={[
    {
      title: 'Learn',
      links: [
        { label: 'Courses', href: '#' },
        { label: 'Resources', href: '#' },
      ],
    },
  ]}
  social={[
    { icon: 'X', href: '#' },
    { icon: 'LinkedIn', href: '#' },
  ]}
  copyright="© 2024 Kairaa Academy"
/>
```

---

## Best Practices

### 1. Responsive Design
```jsx
// Always mobile-first
<div className="
  text-base        // mobile
  md:text-lg       // tablet
  lg:text-xl       // desktop
">
  Responsive text
</div>

// Hide/show based on screen size
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

### 2. Color Usage
```jsx
// DO: Use semantic colors
<Button variant="error">Delete</Button>
<Alert variant="success">Saved!</Alert>

// DON'T: Use arbitrary colors
<Button style={{ background: '#FF00FF' }}>Click</Button>
```

### 3. Spacing
```jsx
// DO: Use spacing scale
<div className="p-6 mb-4 gap-2">Content</div>

// DON'T: Use arbitrary spacing
<div style={{ padding: '17px', marginBottom: '7px' }}>Content</div>
```

### 4. Typography
```jsx
// DO: Use semantic classes
<h1 className="text-h1">Heading</h1>
<p className="text-body">Body text</p>

// DON'T: Mix styles
<div style={{ fontSize: '28px', fontWeight: '700' }}>Heading</div>
```

### 5. Component Composition
```jsx
// DO: Compose simple components
<Card className="p-6">
  <h3 className="text-h5 mb-2">Title</h3>
  <Button>Action</Button>
</Card>

// DON'T: One massive component
<ComplexCardWithEverything />
```

### 6. Conditional Styling
```jsx
// DO: Use Tailwind classes
<div className={`
  p-4 rounded-lg
  ${isError ? 'bg-error-50 border-error-500' : 'bg-white border-neutral-200'}
`}>

// DON'T: Complex ternaries
<div style={{
  background: isError ? '#FEE2E2' : 'white',
  border: isError ? '1px solid #EF4444' : '1px solid #E2E8F0'
}}>
```

---

## Accessibility

### WCAG AA Compliance Checklist

- [x] Color contrast ratio ≥ 4.5:1 for normal text
- [x] Color contrast ratio ≥ 3:1 for large text (24px+)
- [x] All interactive elements keyboard accessible
- [x] Focus indicators visible (2px+ outline)
- [x] Form labels properly associated with inputs
- [x] Semantic HTML (nav, main, section, article)
- [x] Image alt text provided
- [x] Heading hierarchy logical (h1 → h2 → h3)
- [x] Skip to main content link (if needed)

### Keyboard Navigation

```jsx
// All buttons keyboard accessible by default
<Button>Click Me</Button>

// Form inputs auto-focusable
<Input label="Email" />

// Custom components must include:
// - tabIndex={0} for custom buttons
// - onKeyDown handlers for Enter/Space
// - aria-label for icon-only elements

<IconButton aria-label="Close" onClick={handleClose}>
  ✕
</IconButton>
```

### Screen Reader Support

```jsx
// Use semantic HTML
<nav>Navigation</nav>
<main>Main content</main>
<article>Article content</article>

// Label form fields
<label htmlFor="email">Email</label>
<Input id="email" />

// Icon buttons need labels
<button aria-label="Delete item">🗑️</button>

// Dynamic content announcements
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

---

## Performance

### Image Optimization

```jsx
// DO: Optimized images with srcset
<img 
  src="image.jpg"
  srcSet="image-small.jpg 640w, image-large.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Description"
/>

// DO: Use WebP with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// DON'T: Unoptimized, oversized images
<img src="huge-image-5mb.jpg" alt="Description" />
```

### Code Splitting

```jsx
// Lazy load components
const CourseDetail = React.lazy(() => import('./CourseDetail'));

<Suspense fallback={<Skeleton />}>
  <CourseDetail id={courseId} />
</Suspense>
```

### Performance Metrics

Target metrics:
- **Lighthouse Score**: 90+
- **First Contentful Paint (FCP)**: < 2 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5 seconds

---

## Migration Guide (from old design)

### Color Changes
```
Old: #0099FF → New: #0066FF (primary-500)
Old: #FF4444 → New: #EF4444 (error-500)
Old: Random colors → New: Standardized palette
```

### Typography Changes
```
Old: Various sizes → New: Strict type scale
Old: 4+ font weights → New: 2 weights only (400, 600)
Old: No line-height → New: Consistent line-heights
```

### Spacing Changes
```
Old: Random padding → New: 8px base unit scale
Old: Inconsistent gaps → New: 24px between sections
Old: No max-width → New: 1400px container
```

### Component Updates
- Replace old buttons with new `<Button>` component
- Replace old cards with `<Card>` component
- Use `<FormGroup>` for all forms
- Update all alerts to use `<Alert>` component

---

## Support & Resources

- **Figma File**: [Link to Figma design]
- **Storybook**: [Link to Storybook]
- **GitHub**: [Link to component repo]
- **Support Email**: design@kairaacademy.com

---

*Last updated: 2024*
*Version: 1.0*

# Kairaa Academy Design System - Quick Start Guide

## 📋 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
```

### Step 2: Configure Tailwind

1. Copy the `tailwind.config.js` from this design system
2. Update your `tailwind.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
}
```

### Step 3: Install Components

1. Copy the `components-library.jsx` file to your project
2. Import components as needed:

```jsx
import { Button, Card, Input, Section } from '@/components';
```

### Step 4: Start Using Components

```jsx
import { Button, Card, HeroSection, Section, Grid } from '@/components';

export default function App() {
  return (
    <div>
      <HeroSection 
        title="Welcome to Kairaa Academy"
        subtitle="Master blockchain development"
      />
      <Section title="Featured Courses">
        <Grid columns={3}>
          <Card>
            <h3 className="text-h5">Course 1</h3>
            <p className="text-body text-neutral-600">Description here</p>
            <Button className="mt-4">Learn More</Button>
          </Card>
        </Grid>
      </Section>
    </div>
  );
}
```

---

## 🎨 Using the Design System

### Colors

```jsx
// Using primary color
<div className="bg-primary-500 text-white">Primary Blue</div>

// Using semantic colors
<div className="bg-success-50 border-success-500 text-success-900">
  Success message
</div>

// All variants available
primary-50, primary-100, ..., primary-900
secondary-50, ..., secondary-900
success-50, ..., success-900
error-50, ..., error-900
warning-50, ..., warning-900
info-50, ..., info-900
neutral-50, ..., neutral-900
```

### Typography

```jsx
// Headings
<h1 className="text-h1">Large Heading (48px)</h1>
<h2 className="text-h2">Section Title (36px)</h2>
<h3 className="text-h3">Subsection (28px)</h3>
<h4 className="text-h4">Card Title (24px)</h4>
<h5 className="text-h5">Component Header (20px)</h5>
<h6 className="text-h6">Small Header (16px)</h6>

// Body Text
<p className="text-body-lg">Large body text (18px)</p>
<p className="text-body">Regular body text (16px)</p>
<p className="text-body-sm">Small body text (14px)</p>
<label className="text-label">Form label (14px, 500 weight)</label>
<span className="text-caption">Caption/help text (12px)</span>
```

### Spacing

```jsx
// Padding
<div className="p-2">   {/* xs: 2px */}
<div className="p-4">   {/* sm: 4px */}
<div className="p-8">   {/* md: 8px */}
<div className="p-12">  {/* lg: 12px */}
<div className="p-16">  {/* xl: 16px */}
<div className="p-24">  {/* 2xl: 24px */}
<div className="p-32">  {/* 3xl: 32px */}
<div className="p-48">  {/* 4xl: 48px */}
<div className="p-64">  {/* 5xl: 64px */}

// Margin
<div className="m-4">   {/* Margin all sides */}
<div className="mt-8">  {/* Margin-top only */}
<div className="mb-16"> {/* Margin-bottom only */}
<div className="mx-auto"> {/* Horizontal auto (centering) */}

// Gap (for flex/grid)
<div className="flex gap-2">   {/* xs: 2px */}
<div className="flex gap-4">   {/* sm: 4px */}
<div className="grid gap-6">   {/* md: 8px + more */}
<div className="flex gap-12">  {/* lg: 12px */}
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="
  text-base          // Mobile: 16px
  md:text-lg         // Tablet: 18px
  lg:text-xl         // Desktop: 20px
  
  p-4                // Mobile: 4px padding
  md:p-6             // Tablet: 6px padding
  lg:p-8             // Desktop: 8px padding
  
  grid-cols-1        // Mobile: 1 column
  md:grid-cols-2     // Tablet: 2 columns
  lg:grid-cols-3     // Desktop: 3 columns
  
  hidden md:block     // Hidden on mobile, shown on tablet+
">
  Responsive content
</div>
```

---

## 🧩 Common Component Patterns

### Navigation Bar

```jsx
<Navbar
  logo="Kairaa Academy"
  items={[
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
  ]}
  rightContent={
    <>
      <Button variant="tertiary">Sign In</Button>
      <Button>Sign Up</Button>
    </>
  }
/>
```

### Hero Section

```jsx
<HeroSection
  title="Master Blockchain Development"
  subtitle="Learn Web3 from industry experts"
  ctaText="Start Learning"
  ctaSecondary="View Pricing"
  onCTAClick={() => navigate('/courses')}
  backgroundGradient="from-primary-600 to-secondary-600"
/>
```

### Course Grid

```jsx
<Section title="Featured Courses" subtitle="Choose from our catalog">
  <Grid columns={3}>
    {courses.map(course => (
      <CourseCard
        key={course.id}
        image={course.image}
        badge={course.level}
        title={course.title}
        description={course.description}
        price={course.price}
        onEnroll={() => enrollCourse(course.id)}
      />
    ))}
  </Grid>
</Section>
```

### Forms

```jsx
<FormGroup
  fields={[
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
    },
    {
      name: 'course',
      type: 'select',
      label: 'Select Course',
      options: [
        { label: 'Blockchain Basics', value: 'basics' },
        { label: 'Smart Contracts', value: 'contracts' },
      ],
      required: true,
    },
  ]}
  submitText="Register"
  onSubmit={(data, setErrors) => {
    if (!validateForm(data)) {
      setErrors({ email: 'Invalid email' });
      return;
    }
    submitForm(data);
  }}
/>
```

### Card Layouts

```jsx
// Simple card with content
<Card>
  <h3 className="text-h5 mb-2">Card Title</h3>
  <p className="text-body text-neutral-600 mb-4">Card content here</p>
  <Button>Action</Button>
</Card>

// Course card with image
<CourseCard
  image="course-image.jpg"
  badge="Beginner"
  title="Course Title"
  description="Learn about..."
  price={99}
  instructor="Instructor Name"
  rating={4.8}
  onEnroll={handleEnroll}
/>

// Stats card
<StatCard
  icon="📊"
  label="Total Students"
  value="12,500+"
  change="23%"
  isPositive={true}
/>
```

### Tables

```jsx
<Table
  columns={[
    { label: 'Student Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Course', key: 'course' },
    { label: 'Progress', key: 'progress' },
  ]}
  data={students}
  actions={(student) => (
    <>
      <Button size="sm" variant="secondary">
        View Profile
      </Button>
      <Button size="sm" variant="tertiary">
        Message
      </Button>
    </>
  )}
/>
```

### Forms with Validation

```jsx
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleSubmit = (data, setFieldErrors) => {
  const newErrors = {};
  
  if (!data.email.includes('@')) {
    newErrors.email = 'Please enter a valid email';
  }
  
  if (data.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }
  
  if (Object.keys(newErrors).length > 0) {
    setFieldErrors(newErrors);
    return;
  }
  
  // Submit to server
  submitForm(data);
};

return (
  <FormGroup
    fields={[
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'password', type: 'password', label: 'Password', required: true },
    ]}
    submitText="Sign In"
    onSubmit={handleSubmit}
  />
);
```

### Modals

```jsx
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>
  Open Modal
</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Enrollment"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Enroll Now
      </Button>
    </>
  }
>
  <p className="text-body text-neutral-700">
    You are about to enroll in "Smart Contracts 101" for $99.
    This course includes lifetime access and a certificate.
  </p>
</Modal>
```

---

## 🎯 Common Mistakes to Avoid

### ❌ Don't do this:

```jsx
// Using arbitrary colors
<div className="bg-[#FF00FF]">Wrong</div>

// Mixing spacing units
<div className="p-5 m-3 gap-7">Wrong</div>

// Ignoring responsive design
<div className="grid grid-cols-4">4 columns on mobile!</div>

// Not using semantic HTML
<div style={{ fontSize: '32px', fontWeight: 'bold' }}>
  Should be H1
</div>

// Poor color contrast
<span style={{ color: '#999999' }} className="bg-white">
  Unreadable!
</span>
```

### ✅ Do this instead:

```jsx
// Use design system colors
<div className="bg-primary-500">Right</div>

// Use spacing scale
<div className="p-6 m-4 gap-2">Right</div>

// Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  Responsive!
</div>

// Use semantic components
<h1 className="text-h1">Correct</h1>

// Good color contrast
<span className="text-neutral-900 bg-white">
  Readable!
</span>
```

---

## 📱 Responsive Design Best Practices

### Mobile-First Workflow

1. **Design for mobile first** (320px minimum)
2. **Add breakpoints for tablet** (768px)
3. **Optimize for desktop** (1024px+)

```jsx
// Example: Responsive layout
<div className="
  grid
  grid-cols-1          // Mobile: 1 column
  gap-4                // Mobile: small gap
  
  md:grid-cols-2       // Tablet: 2 columns
  md:gap-6             // Tablet: larger gap
  
  lg:grid-cols-3       // Desktop: 3 columns
  lg:gap-8             // Desktop: even larger gap
">
  {items.map(item => <Card key={item.id}>{item.title}</Card>)}
</div>
```

### Common Breakpoints

```
xs: 320px (mobile)
sm: 640px (large mobile)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
2xl: 1536px (ultra-wide)
```

### Testing Responsiveness

1. Test in Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test all breakpoints:
   - iPhone (375px)
   - iPad (768px)
   - Desktop (1440px)

---

## 🚀 Deployment Checklist

- [ ] All components imported and tested
- [ ] Color system applied throughout
- [ ] Typography hierarchy correct
- [ ] Spacing consistent (8px scale)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Forms validation working
- [ ] Images optimized (WebP, srcset)
- [ ] Lighthouse score 90+
- [ ] WCAG AA accessibility compliant
- [ ] Meta tags and SEO optimized

---

## 🔗 File Structure

```
src/
├── components/
│   └── index.jsx           (All components)
├── pages/
│   ├── HomePage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseDetailPage.jsx
│   └── LoginPage.jsx
├── styles/
│   └── tailwind.css        (Tailwind directives)
├── App.jsx
└── index.js
public/
└── index.html

tailwind.config.js          (Design tokens)
```

---

## 📚 Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Component Storybook**: [Link to your Storybook]
- **Design Figma**: [Link to Figma]
- **Live Demo**: [Link to demo site]

---

## 💡 Tips & Tricks

### 1. Use Utility Classes First
Always use Tailwind utilities before creating custom CSS.

### 2. Create Component Presets
```jsx
// Button presets
export const PrimaryButton = (props) => (
  <Button variant="primary" size="lg" {...props} />
);

export const SecondaryButton = (props) => (
  <Button variant="secondary" size="md" {...props} />
);
```

### 3. Use Tailwind Plugins
```js
// tailwind.config.js
plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
]
```

### 4. Create Custom Utilities
```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

---

## ⚡ Performance Tips

1. **Lazy load components**: Use React.lazy() for routes
2. **Optimize images**: Use WebP with fallbacks
3. **Minify CSS**: Tailwind does this automatically
4. **Use CSS Grid**: More efficient than flex for layouts
5. **Avoid shadows**: They impact performance
6. **Debounce events**: Resize, scroll handlers

---

## 🆘 Need Help?

- Check the DESIGN_SYSTEM_GUIDE.md for detailed docs
- Review example-pages.jsx for implementation examples
- Check component PropTypes in components-library.jsx
- Test in Storybook
- Email: support@kairaacademy.com

---

*Happy designing! 🎉*

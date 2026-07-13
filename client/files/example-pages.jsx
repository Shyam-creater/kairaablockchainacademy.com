// src/pages/HomePage.jsx
// Complete example showing how to use all design system components

import React from 'react';
import {
  Navbar,
  Button,
  HeroSection,
  Section,
  Container,
  Grid,
  CourseCard,
  TestimonialCard,
  StatCard,
  Card,
  Badge,
  Footer,
  Alert,
  Input,
  FormGroup,
  Table,
} from '../components';

export default function HomePage() {
  // Sample course data
  const courses = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1639762681033-6461ffad8d80?w=400&h=250&fit=crop',
      badge: 'Beginner',
      title: 'Introduction to Blockchain',
      description: 'Learn the fundamentals of blockchain technology and cryptocurrency',
      price: 99,
      instructor: 'John Doe',
      rating: 4.8,
      students: '2,341',
      onEnroll: () => alert('Enrolled!'),
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1642104704074-dfa3d152e3c8?w=400&h=250&fit=crop',
      badge: 'Intermediate',
      title: 'Smart Contracts with Solidity',
      description: 'Master Solidity and develop smart contracts on Ethereum',
      price: 149,
      instructor: 'Jane Smith',
      rating: 4.9,
      students: '1,892',
      onEnroll: () => alert('Enrolled!'),
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1639762682257-604b52b0795c?w=400&h=250&fit=crop',
      badge: 'Advanced',
      title: 'DeFi Development Masterclass',
      description: 'Build decentralized finance applications from scratch',
      price: 199,
      instructor: 'Mike Johnson',
      rating: 4.7,
      students: '1,245',
      onEnroll: () => alert('Enrolled!'),
    },
  ];

  const testimonials = [
    {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop',
      name: 'Sarah Chen',
      role: 'Full-Stack Developer',
      quote: 'Kairaa Academy helped me transition into blockchain development. The courses are comprehensive and well-structured.',
      rating: 5,
    },
    {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop',
      name: 'Alex Rodriguez',
      role: 'Web3 Entrepreneur',
      quote: 'The practical projects and mentorship here are unmatched. Highly recommend to anyone serious about Web3.',
      rating: 5,
    },
    {
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop',
      name: 'Emma Wilson',
      role: 'Blockchain Engineer',
      quote: 'Best investment in my tech career. Learned more here than in years of self-study.',
      rating: 5,
    },
  ];

  const stats = [
    { icon: '👥', label: 'Active Students', value: '12,500+', change: '23%', isPositive: true },
    { icon: '📚', label: 'Courses', value: '50+', change: '8%', isPositive: true },
    { icon: '⭐', label: 'Avg Rating', value: '4.8/5', change: '0.2', isPositive: true },
    { icon: '🏆', label: 'Graduates', value: '8,900+', change: '42%', isPositive: true },
  ];

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Courses', href: '#courses' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const footerSections = [
    {
      title: 'Learn',
      links: [
        { label: 'All Courses', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Resources', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Partners', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
  ];

  const handleNewsletterSubmit = (data, setErrors) => {
    if (!data.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    alert('Thanks for subscribing!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar
        logo="Kairaa Academy"
        items={navItems}
        rightContent={
          <>
            <Button variant="tertiary" size="md">Sign In</Button>
            <Button size="md">Sign Up</Button>
          </>
        }
      />

      {/* Hero Section */}
      <HeroSection
        title="Master Blockchain Development"
        subtitle="Learn to build Web3 applications with industry experts. Start your blockchain journey today."
        ctaText="Start Learning"
        ctaSecondary="Explore Courses"
        onCTAClick={() => alert('Starting course...')}
      />

      {/* Alert Banner */}
      <Container className="py-6">
        <Alert
          variant="info"
          title="🎉 Limited Time Offer"
          message="Get 50% off all courses for the first 100 students. Enroll now!"
          onClose={() => {}}
        />
      </Container>

      {/* Stats Section */}
      <Section title="Why Choose Kairaa Academy?" padding="py-16">
        <Grid columns={4}>
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </Grid>
      </Section>

      {/* Featured Courses */}
      <Section 
        id="courses"
        title="Featured Courses"
        subtitle="Select from our comprehensive catalog of blockchain and Web3 courses"
        className="bg-neutral-50"
      >
        <Grid columns={3}>
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </Grid>
        <div className="text-center mt-12">
          <Button size="lg">View All Courses</Button>
        </div>
      </Section>

      {/* How It Works */}
      <Section 
        title="How It Works"
        subtitle="Our proven learning methodology gets you results"
        padding="py-16"
      >
        <Grid columns={3} gap="xl">
          {[
            {
              icon: '1️⃣',
              title: 'Choose Your Path',
              description: 'Select from beginner to advanced courses tailored to your goals',
            },
            {
              icon: '2️⃣',
              title: 'Learn from Experts',
              description: 'Study with industry professionals who are actively building in Web3',
            },
            {
              icon: '3️⃣',
              title: 'Build & Launch',
              description: 'Complete real projects and deploy them to blockchain networks',
            },
          ].map((step, idx) => (
            <Card key={idx} className="text-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-h5 text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-body text-neutral-600">{step.description}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Testimonials */}
      <Section 
        title="Student Success Stories"
        subtitle="Hear from students who've transformed their careers"
        className="bg-neutral-50"
      >
        <Grid columns={3}>
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </Grid>
      </Section>

      {/* Pricing Section */}
      <Section 
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that fits your learning style"
        padding="py-16"
      >
        <Grid columns={3}>
          {[
            {
              name: 'Starter',
              price: '$29',
              features: ['Access to 5 courses', 'Community support', 'Lifetime access', 'Certificates'],
            },
            {
              name: 'Professional',
              price: '$79',
              features: ['All Starter features', 'All 50+ courses', '1-on-1 mentoring', 'Project code reviews'],
              highlighted: true,
            },
            {
              name: 'Premium',
              price: '$199',
              features: ['All Professional features', 'Career coaching', 'Job guarantee', 'Private community'],
            },
          ].map((plan, idx) => (
            <Card 
              key={idx} 
              className={plan.highlighted ? 'border-primary-500 border-2 ring-2 ring-primary-100 relative' : ''}
            >
              {plan.highlighted && (
                <Badge variant="primary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-h5 text-neutral-900 mb-2 mt-2">{plan.name}</h3>
              <div className="text-h3 text-primary-600 font-bold mb-6">{plan.price}/month</div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-body text-neutral-700">
                    <span className="text-primary-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.highlighted ? 'primary' : 'secondary'} 
                className="w-full"
              >
                Get Started
              </Button>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* Newsletter Signup */}
      <Section 
        title="Stay Updated"
        subtitle="Get the latest courses, tips, and blockchain news delivered to your inbox"
        className="bg-primary-50"
        padding="py-16"
      >
        <div className="max-w-md mx-auto">
          <FormGroup
            fields={[
              {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'you@example.com',
                required: true,
              },
            ]}
            submitText="Subscribe"
            onSubmit={handleNewsletterSubmit}
          />
        </div>
      </Section>

      {/* Data Table Example */}
      <Section 
        title="Trending Courses This Week"
        padding="py-16"
      >
        <Table
          columns={[
            { label: 'Course Name', key: 'name' },
            { label: 'Instructor', key: 'instructor' },
            { label: 'Students', key: 'students' },
            { label: 'Rating', key: 'rating' },
          ]}
          data={[
            { name: 'Introduction to Blockchain', instructor: 'John Doe', students: '2,341', rating: '⭐ 4.8' },
            { name: 'Smart Contracts with Solidity', instructor: 'Jane Smith', students: '1,892', rating: '⭐ 4.9' },
            { name: 'DeFi Development Masterclass', instructor: 'Mike Johnson', students: '1,245', rating: '⭐ 4.7' },
          ]}
          actions={(row) => (
            <>
              <Button size="sm" variant="secondary">View</Button>
              <Button size="sm" variant="tertiary">Enroll</Button>
            </>
          )}
        />
      </Section>

      {/* Footer */}
      <Footer
        companyName="Kairaa Blockchain Academy"
        description="Empowering the next generation of blockchain developers with world-class education and mentorship."
        sections={footerSections}
        social={[
          { icon: '𝕏', href: '#' },
          { icon: 'f', href: '#' },
          { icon: 'in', href: '#' },
          { icon: '▶️', href: '#' },
        ]}
        copyright="© 2024 Kairaa Blockchain Academy. All rights reserved."
      />
    </div>
  );
}

// ============================================
// REUSABLE PATTERNS & EXAMPLES
// ============================================

// Example 1: Course Detail Page
export function CourseDetailPage() {
  const [enrolled, setEnrolled] = React.useState(false);

  return (
    <div>
      <Navbar logo="Kairaa Academy" items={[]} />
      
      <div className="h-96 bg-gradient-to-r from-primary-600 to-secondary-600">
        {/* Hero Image */}
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h1 className="text-h2 text-neutral-900 mb-4">Smart Contracts with Solidity</h1>
            <div className="flex items-center gap-4 mb-8">
              <Badge>Intermediate</Badge>
              <span className="text-warning-500">★★★★★ (4.9)</span>
              <span className="text-neutral-600">2,341 students</span>
            </div>
            
            <Card className="mb-8">
              <h3 className="text-h5 mb-4">What You'll Learn</h3>
              <ul className="space-y-2">
                {['Smart contract fundamentals', 'Solidity programming', 'Gas optimization', 'Security best practices'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-h5 mb-4">Course Curriculum</h3>
              {/* Module list here */}
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <div className="text-center mb-6">
                <div className="text-h2 text-primary-600 font-bold">$149</div>
                <p className="text-neutral-600">One-time payment</p>
              </div>
              <Button 
                onClick={() => setEnrolled(true)}
                className="w-full mb-3"
              >
                {enrolled ? 'Enrolled ✓' : 'Enroll Now'}
              </Button>
              <Button variant="secondary" className="w-full">
                Add to Wishlist
              </Button>
              <div className="border-t border-neutral-200 mt-6 pt-6">
                <p className="text-caption text-neutral-600 mb-2">Instructor</p>
                <p className="text-body font-semibold text-neutral-900">Jane Smith</p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Example 2: Login Form Page
export function LoginPage() {
  const handleLogin = (data, setErrors) => {
    if (!data.email || !data.password) {
      setErrors({
        email: !data.email ? 'Email is required' : '',
        password: !data.password ? 'Password is required' : '',
      });
      return;
    }
    alert('Login successful!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-h3 text-neutral-900 mb-2">Welcome Back</h1>
        <p className="text-body text-neutral-600 mb-8">Sign in to your Kairaa Academy account</p>

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
              name: 'password',
              type: 'password',
              label: 'Password',
              placeholder: '••••••••',
              required: true,
            },
          ]}
          submitText="Sign In"
          onSubmit={handleLogin}
        />

        <div className="mt-6 text-center">
          <p className="text-body text-neutral-600">
            Don't have an account?{' '}
            <a href="#" className="text-primary-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}

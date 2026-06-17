// src/components/index.jsx
// Complete Component Library for Kairaa Blockchain Academy

import React, { useState } from 'react';

// ============================================
// 1. BUTTON COMPONENTS
// ============================================

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-500 disabled:bg-neutral-400 disabled:opacity-50',
    secondary: 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
    tertiary: 'bg-transparent text-primary-500 hover:bg-primary-50 focus:ring-primary-300',
    danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 focus:ring-error-500 disabled:opacity-50',
    success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus:ring-success-500',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin">⟳</span>}
      {children}
    </button>
  );
};

// ============================================
// 2. INPUT & FORM COMPONENTS
// ============================================

export const Input = ({ 
  label, 
  error, 
  required = false,
  helperText,
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-label text-neutral-900 font-medium">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          h-10 px-4 rounded-lg border-2 text-base
          border-neutral-200 bg-white
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
          placeholder:text-neutral-400
          disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
          transition-colors duration-300
          ${error ? 'border-error-500 focus:ring-error-100' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-caption text-error-500 flex items-center gap-1">⚠️ {error}</span>}
      {helperText && !error && <span className="text-caption text-neutral-500">{helperText}</span>}
    </div>
  );
};

export const TextArea = ({ 
  label, 
  error, 
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-label text-neutral-900 font-medium">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          px-4 py-3 rounded-lg border-2 text-base font-sans
          border-neutral-200 bg-white
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
          placeholder:text-neutral-400
          disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
          transition-colors duration-300 resize-none
          ${error ? 'border-error-500 focus:ring-error-100' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-caption text-error-500">⚠️ {error}</span>}
    </div>
  );
};

export const Select = ({ 
  label, 
  error, 
  required = false,
  options = [],
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-label text-neutral-900 font-medium">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          h-10 px-4 rounded-lg border-2 text-base bg-white
          border-neutral-200
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
          disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
          transition-colors duration-300
          ${error ? 'border-error-500 focus:ring-error-100' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-caption text-error-500">⚠️ {error}</span>}
    </div>
  );
};

export const Checkbox = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={`
            w-5 h-5 rounded-md border-2 border-neutral-200
            accent-primary-500
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${className}
          `}
          {...props}
        />
        <span className="text-body text-neutral-900">{label}</span>
      </label>
      {error && <span className="text-caption text-error-500">⚠️ {error}</span>}
    </div>
  );
};

// ============================================
// 3. CARD COMPONENTS
// ============================================

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-neutral-200 shadow-sm
        hover:shadow-lg transition-shadow duration-300
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CourseCard = ({ 
  image, 
  badge, 
  title, 
  description, 
  price, 
  instructor,
  rating,
  students,
  onEnroll
}) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl">
      <div className="relative mb-4 overflow-hidden rounded-lg bg-neutral-200 h-48">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        {badge && (
          <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-caption font-medium">
            {badge}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-h5 text-neutral-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-body-sm text-neutral-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-caption text-neutral-600">
          {instructor && <span>{instructor}</span>}
          {rating && (
            <div className="flex items-center gap-1">
              <span className="text-warning-500">★</span>
              <span>{rating}</span>
            </div>
          )}
          {students && <span>{students} students</span>}
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-h5 text-primary-500 font-semibold">${price}</span>
          <Button size="sm" onClick={onEnroll}>Enroll</Button>
        </div>
      </div>
    </Card>
  );
};

export const TestimonialCard = ({ avatar, name, role, quote, rating = 5 }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="text-body font-semibold text-neutral-900">{name}</h4>
          <p className="text-caption text-neutral-600">{role}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-warning-500">★</span>
        ))}
      </div>
      <p className="text-body italic text-neutral-700">"{quote}"</p>
    </Card>
  );
};

export const StatCard = ({ icon, label, value, change, isPositive }) => {
  return (
    <Card className="text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-caption text-neutral-600 mb-2">{label}</p>
      <h3 className="text-h3 text-neutral-900 font-bold mb-2">{value}</h3>
      {change && (
        <p className={`text-caption font-medium ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
          {isPositive ? '↑' : '↓'} {change} from last month
        </p>
      )}
    </Card>
  );
};

// ============================================
// 4. BADGE & LABEL COMPONENTS
// ============================================

export const Badge = ({ 
  variant = 'primary', 
  size = 'md',
  className = '',
  children,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-caption',
    lg: 'px-4 py-2 text-body-sm',
  };

  return (
    <span className={`rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const Tag = ({ label, onRemove, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-3 py-1 ${className}`}>
      <span className="text-body-sm text-primary-800">{label}</span>
      {onRemove && (
        <button onClick={onRemove} className="text-primary-600 hover:text-primary-800 font-bold">×</button>
      )}
    </div>
  );
};

// ============================================
// 5. NAVBAR & NAVIGATION
// ============================================

export const Navbar = ({ logo, items, rightContent, sticky = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className={`bg-white border-b border-neutral-200 ${sticky ? 'sticky top-0 z-50' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="text-h4 font-bold text-primary-600">{logo}</div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {items?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="text-body text-neutral-700 hover:text-primary-600 transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Content */}
            <div className="hidden md:flex items-center gap-4">
              {rightContent}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-neutral-200">
              {items?.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="block px-4 py-2 text-body text-neutral-700 hover:bg-neutral-50"
                >
                  {item.label}
                </a>
              ))}
              <div className="px-4 py-4 border-t border-neutral-200">
                {rightContent}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

// ============================================
// 6. FOOTER COMPONENT
// ============================================

export const Footer = ({ 
  companyName, 
  description,
  sections = [],
  social = [],
  copyright
}) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-h5 text-white font-bold mb-3">{companyName}</h3>
            <p className="text-body-sm text-neutral-400">{description}</p>
            <div className="flex gap-4 mt-4">
              {social.map((s, idx) => (
                <a key={idx} href={s.href} className="text-neutral-400 hover:text-white transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-body font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, lidx) => (
                  <li key={lidx}>
                    <a href={link.href} className="text-body-sm text-neutral-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8 text-center text-body-sm text-neutral-400">
          {copyright}
        </div>
      </div>
    </footer>
  );
};

// ============================================
// 7. TABLE COMPONENT
// ============================================

export const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-label font-semibold text-neutral-900">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-label font-semibold text-neutral-900">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ridx) => (
            <tr key={ridx} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
              {columns.map((col, cidx) => (
                <td key={cidx} className="px-6 py-4 text-body text-neutral-700">
                  {row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 flex gap-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// 8. MODAL & DIALOG COMPONENT
// ============================================

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${sizes[size]} w-full`}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-h4 text-neutral-900 font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-neutral-200 flex gap-4 justify-end">{footer}</div>}
      </div>
    </div>
  );
};

// ============================================
// 9. ALERT & NOTIFICATION
// ============================================

export const Alert = ({ 
  variant = 'info', 
  title, 
  message,
  onClose,
  className = ''
}) => {
  const variants = {
    success: 'bg-success-50 border-success-300 text-success-800',
    error: 'bg-error-50 border-error-300 text-error-800',
    warning: 'bg-warning-50 border-warning-300 text-warning-800',
    info: 'bg-info-50 border-info-300 text-info-800',
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${variants[variant]} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-bold text-body mb-1">{title}</h4>}
          <p className="text-body-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4 font-bold text-xl">×</button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 10. HERO SECTION
// ============================================

export const HeroSection = ({ 
  title, 
  subtitle,
  ctaText,
  ctaSecondary,
  backgroundImage,
  backgroundGradient = 'from-primary-600 to-primary-800',
  onCTAClick,
  onSecondaryClick
}) => {
  return (
    <section className={`relative min-h-screen bg-gradient-to-r ${backgroundGradient} flex items-center overflow-hidden`}>
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-90"></div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 w-full py-20 text-center">
        <h1 className="text-h1 text-white mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-body-lg text-neutral-100 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={onCTAClick}
          >
            {ctaText}
          </Button>
          {ctaSecondary && (
            <Button 
              variant="tertiary" 
              size="lg"
              className="text-white border-white hover:bg-white/10"
              onClick={onSecondaryClick}
            >
              {ctaSecondary}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 11. GRID & LAYOUT COMPONENTS
// ============================================

export const Container = ({ children, className = '' }) => {
  return (
    <div className={`max-w-6xl mx-auto px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
};

export const Section = ({ 
  title, 
  subtitle,
  children, 
  className = '',
  padding = 'py-20'
}) => {
  return (
    <section className={`${padding} ${className}`}>
      <Container>
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <h2 className="text-h2 text-neutral-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};

export const Grid = ({ columns = 3, gap = '2xl', children, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
    '2xl': 'gap-16',
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gaps[gap]} ${className}`}>
      {children}
    </div>
  );
};

// ============================================
// 12. FORMS & VALIDATION
// ============================================

export const FormGroup = ({ 
  fields = [], 
  onSubmit,
  submitText = 'Submit',
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData, setErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type === 'textarea' ? (
            <TextArea
              {...field}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={errors[field.name]}
            />
          ) : field.type === 'select' ? (
            <Select
              {...field}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={errors[field.name]}
            />
          ) : (
            <Input
              {...field}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={errors[field.name]}
            />
          )}
        </div>
      ))}
      <Button type="submit" size="lg" loading={loading}>
        {submitText}
      </Button>
    </form>
  );
};

export default {
  Button,
  Input,
  TextArea,
  Select,
  Checkbox,
  Card,
  CourseCard,
  TestimonialCard,
  StatCard,
  Badge,
  Tag,
  Navbar,
  Footer,
  Table,
  Modal,
  Alert,
  HeroSection,
  Container,
  Section,
  Grid,
  FormGroup,
};

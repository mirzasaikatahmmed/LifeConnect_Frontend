# LifeConnect Components

This directory contains all the reusable components for the LifeConnect Frontend application, organized by functionality and enhanced with both Tailwind CSS and Material UI.

## 📁 Folder Structure

```
components/
├── ui/                    # Core UI Components
│   ├── Button.tsx        # Enhanced button with variants and animations
│   ├── Input.tsx         # Advanced input with icons and validation
│   ├── Card.tsx          # Card components with hover effects
│   └── index.ts          # Barrel exports
├── layout/               # Layout Components
│   ├── Header.tsx        # Responsive navigation header
│   └── Footer.tsx        # Rich footer with social links
├── auth/                 # Authentication Components
│   ├── LoginForm.tsx     # Login form with validation
│   ├── RegisterForm.tsx  # Registration form with password strength
│   ├── AdminRegisterForm.tsx    # Admin registration form
│   ├── AdminRegisterContainer.tsx # Admin registration wrapper
│   └── index.ts          # Barrel exports
├── common/               # Shared Components
│   └── AuthContainer.tsx # Authentication page wrapper
├── forms/                # Form Components (ready for expansion)
└── _archive/             # Legacy components (preserved)
```

## 🎨 Design System

### Color Palette
- **Primary**: #667eea (Purple-Blue gradient start)
- **Secondary**: #764ba2 (Purple gradient end)
- **Background**: CSS variables for light/dark mode support

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Scales**: Material UI typography scales with custom overrides

### Animations
- **slide-up**: Entrance animations for components
- **bounce-gentle**: Error feedback animations
- **fade-in**: General fade transitions
- **hover effects**: Scale and shadow transitions

## 🚀 Component Features

### UI Components

#### Button
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**: Loading states, hover animations, gradient backgrounds
- **Usage**: `<Button variant="primary" size="lg">Click me</Button>`

#### Input
- **Features**: Start/end icons, validation states, error messages
- **Types**: text, email, password, tel, select
- **Variants**: outlined, filled, standard
- **Usage**: `<Input label="Email" startIcon={<Email />} error={!!error} />`

#### Card
- **Features**: Hover effects, flexible padding, border radius
- **Components**: Card, CardHeader, CardBody, CardFooter
- **Usage**: `<Card hover padding="lg"><CardBody>Content</CardBody></Card>`

### Layout Components

#### Header
- **Features**: Responsive navigation, mobile menu, sticky positioning
- **Navigation**: Desktop and mobile-friendly
- **Branding**: Logo with gradient background
- **Authentication**: Login/Register buttons

#### Footer
- **Features**: Multi-column layout, social media links, newsletter signup
- **Sections**: Company info, quick links, support, contact
- **Responsive**: Adapts to mobile screens

### Auth Components

#### LoginForm
- **Features**: Email/password validation, remember me, forgot password link
- **Validation**: Real-time form validation with error messages
- **Security**: Password visibility toggle, loading states
- **UX**: Smooth animations, accessible form controls

#### RegisterForm
- **Features**: Multi-field registration, password strength indicator
- **Validation**: Comprehensive validation for all fields
- **Password**: Real-time strength calculation with visual feedback
- **Terms**: Checkbox for terms and conditions acceptance

#### AdminRegisterForm
- **Features**: Admin-specific fields (blood type, role)
- **Validation**: Enhanced validation for admin requirements
- **UI**: Professional admin interface with info panels
- **Security**: Strong password requirements

## 🛠 Technical Implementation

### Technologies
- **React 18+**: Latest React with hooks and concurrent features
- **TypeScript**: Full type safety across all components
- **Material UI v5**: Component library with theming
- **Tailwind CSS v4**: Utility-first styling framework
- **Next.js 15**: App Router with server/client components

### Styling Strategy
1. **Material UI** for complex interactive components
2. **Tailwind CSS** for layout, spacing, and utility styling
3. **Custom theme** integration between both systems
4. **CSS variables** for consistent color management
5. **Responsive design** with mobile-first approach

### State Management
- **Local state**: useState for component-level state
- **Form state**: Controlled components with validation
- **Error handling**: Centralized error state management
- **Loading states**: UI feedback during async operations

### Accessibility
- **ARIA labels**: Proper labeling for screen readers
- **Keyboard navigation**: Tab order and focus management
- **Color contrast**: WCAG compliant color combinations
- **Form validation**: Clear error messaging and guidance

## 📦 Usage Examples

### Basic Form with Validation
```tsx
import { Input, Button } from '@/components/ui';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <form className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </form>
  );
}
```

### Authentication Page
```tsx
import AuthContainer from '@/components/common/AuthContainer';
import { LoginForm } from '@/components/auth';

function LoginPage() {
  return (
    <AuthContainer title="Welcome Back" subtitle="Sign in to continue">
      <LoginForm onSubmit={handleLogin} />
    </AuthContainer>
  );
}
```

### Custom Card Layout
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';

function FeatureCard() {
  return (
    <Card hover className="max-w-sm">
      <CardHeader>
        <h3 className="text-xl font-bold">Feature Title</h3>
      </CardHeader>
      <CardBody>
        <p>Feature description goes here...</p>
      </CardBody>
      <CardFooter>
        <Button variant="outline">Learn More</Button>
      </CardFooter>
    </Card>
  );
}
```

## 🔄 Migration from Legacy Components

Legacy components are preserved in the `_archive` folder. When migrating:

1. **Review functionality**: Understand the old component's purpose
2. **Update imports**: Use new component paths
3. **Apply new styling**: Utilize Tailwind + Material UI approach
4. **Add validation**: Implement proper form validation
5. **Enhance UX**: Add loading states, animations, and feedback
6. **Test thoroughly**: Ensure all functionality is preserved

## 🚦 Best Practices

### Component Development
- **Single responsibility**: Each component should have one clear purpose
- **Prop validation**: Use TypeScript interfaces for prop types
- **Error boundaries**: Handle errors gracefully
- **Performance**: Use React.memo and useMemo when appropriate

### Styling Guidelines
- **Utility-first**: Prefer Tailwind utilities over custom CSS
- **Consistent spacing**: Use Tailwind's spacing scale
- **Responsive design**: Mobile-first breakpoints
- **Theme integration**: Use Material UI theme tokens

### Accessibility Standards
- **Semantic HTML**: Use appropriate HTML elements
- **ARIA attributes**: Add labels and descriptions where needed
- **Focus management**: Ensure logical tab order
- **Screen reader support**: Test with assistive technologies

---

**Last Updated**: January 2025  
**Version**: 2.0 (Tailwind + Material UI Integration)
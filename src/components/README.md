# Components Documentation

## Common Components

### Button
Reusable button component with multiple variants and sizes.

**Usage:**
```jsx
import Button from './components/common/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: function

---

### Input
Form input component with label and error handling.

**Usage:**
```jsx
import Input from './components/common/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

---

### Modal
Modal dialog component.

**Usage:**
```jsx
import Modal from './components/common/Modal';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  <p>Modal content here</p>
</Modal>
```

---

### Card
Container component with shadow and border.

**Usage:**
```jsx
import Card from './components/common/Card';

<Card title="Card Title">
  <p>Card content</p>
</Card>
```

---

### Badge
Small colored label for status display.

**Usage:**
```jsx
import Badge from './components/common/Badge';

<Badge variant="success">Active</Badge>
```

---

### Alert
Alert/notification component.

**Usage:**
```jsx
import Alert from './components/common/Alert';

<Alert type="success" message="Operation successful!" />
```

---

## Feature Components

### DoctorCard
Displays doctor information in a card format.

### AppointmentTable
Table component for displaying appointments.

### PatientCard
Displays patient information in a card format.

---

## Utils

### formatDate.js
- `formatDate(date)` - Format date to readable string
- `formatTime(date)` - Format time only
- `formatDateTime(date)` - Format both date and time
- `getRelativeTime(date)` - Get relative time (e.g., "2 hours ago")

### roleHelpers.js
- `isAdmin(user)` - Check if user is admin
- `isDoctor(user)` - Check if user is doctor
- `isPatient(user)` - Check if user is patient
- `getRoleBadgeColor(role)` - Get Tailwind color class for role badge

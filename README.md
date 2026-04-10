# Quantity Measurement App - Frontend

A simple web app to compare, convert and do arithmetic on different units of measurement like Length, Weight, Temperature and Volume.

---

## Project Structure

```
QuantityMeasurementApp-Frontend/
│
├── index.html          (Login & Signup page)
├── dashboard.html      (Main app page)
│
├── css/
│   ├── auth.css        (Styles for login/signup page)
│   └── dashboard.css   (Styles for main app page)
│
└── js/
    ├── auth.js         (Logic for login/signup)
    └── dashboard.js    (Logic for main app)
```

---

## Pages

### 1. index.html — Login & Signup Page

This is the first page the user sees. It has two tabs — **Login** and **Signup**.

**Login Tab:**
- Email input
- Password input (with show/hide eye icon)
- Login button
- Link to switch to Signup

**Signup Tab:**
- Full Name input
- Email input
- Password input (with show/hide eye icon)
- Mobile Number input (only 10 digits allowed)
- Signup button
- Link to switch to Login

**Validation Rules:**
- Email must be in valid format (example@mail.com)
- Password must have at least 6 characters, one uppercase letter, one lowercase letter, and one special character (@#$%^&+=!)
- Mobile must be exactly 10 digits
- If any field is wrong, a red error message shows below that field
- On successful login/signup, user is sent to dashboard.html

**How data is stored:**
- User info is saved in browser's `localStorage`
- Key used: `qm_user` (stores the email of logged in user)

---

### 2. dashboard.html — Main App Page

This is the main page after login. It has a header with the app name and a Logout button.

The page has two main sections:

#### Section 1 — Choose Type
Four clickable cards to select the measurement type:
- 📏 Length
- ⚖️ Weight
- 🌡️ Temperature
- 🧴 Volume

The selected card gets a **teal green border**. When you hover over a card, it gets a **blue border**.

#### Section 2 — Choose Action
Three buttons to select what you want to do:
- **Comparison** — Compare two values
- **Conversion** — Convert one unit to another
- **Arithmetic** — Add, subtract, multiply or divide two values

The active button turns **blue**. Each button is equal width and they fill the full row.

---

## Panels (shown based on selected action)

### Comparison Panel
- Two input boxes side by side — FROM and TO
- Each has a number input and a unit dropdown below it
- Result box at bottom shows which value is greater/less/equal
- Result box has a unit dropdown (bottom right) to choose which unit to show result in
- Example output: `1 Kilometer > 500 Meter`

### Conversion Panel
- One input box on left (VALUE) with unit dropdown
- Arrow (→) in middle
- One unit dropdown on right (CONVERT TO)
- Result box at bottom shows the converted value
- Example output: `1 Kilometer = 1000 Meter`

### Arithmetic Panel
- Two input boxes side by side — Value 1 and Value 2
- Each has a number input and a unit dropdown below it
- Operator dropdown in the middle (+, −, ×, ÷)
- Result box at bottom shows the calculation result
- Result box has a unit dropdown (bottom right) to choose which unit to show result in
- Example output: `1 Kilometer + 1 Kilometer = 2 Kilometer`

---

## Measurement Types and Units

### Length
| Unit | Factor (in Meters) |
|---|---|
| Kilometer | 1000 |
| Meter | 1 |
| Centimeter | 0.01 |
| Millimeter | 0.001 |
| Mile | 1609.34 |
| Foot | 0.3048 |
| Inch | 0.0254 |

### Weight
| Unit | Factor (in Kilograms) |
|---|---|
| Kilogram | 1 |
| Gram | 0.001 |
| Milligram | 0.000001 |
| Pound | 0.453592 |
| Ounce | 0.0283495 |
| Tonne | 1000 |

### Temperature
- Celsius
- Fahrenheit
- Kelvin
- (Temperature uses formula-based conversion, not a simple factor)

### Volume
| Unit | Factor (in Liters) |
|---|---|
| Liter | 1 |
| Milliliter | 0.001 |
| Gallon | 3.78541 |
| Cup | 0.236588 |
| Tablespoon | 0.0147868 |

---

## JavaScript Files

### auth.js
Handles everything on the login/signup page:

| Function | What it does |
|---|---|
| `switchTab(tab)` | Switches between Login and Signup tabs |
| `togglePw(inputId, icon)` | Shows or hides password text |
| `isValidEmail(email)` | Checks if email format is correct |
| `setError(errId, inputId, show)` | Shows or hides error message for a field |
| `clearAllErrors()` | Clears all error messages |
| `doLogin()` | Validates login form and redirects to dashboard |
| `doSignup()` | Validates signup form and redirects to dashboard |

### dashboard.js
Handles everything on the main app page:

| Function | What it does |
|---|---|
| `selectType(type)` | Changes the measurement type (length, weight etc) |
| `selectAction(action)` | Switches between Comparison, Conversion, Arithmetic |
| `populateSelects(type)` | Fills all dropdowns with units for the selected type |
| `fillDropdown(id, units, selected)` | Fills a single dropdown with options |
| `compute()` | Calls the right compute function based on current action |
| `computeComparison()` | Calculates and shows comparison result |
| `computeConversion()` | Calculates and shows conversion result |
| `computeArithmetic()` | Calculates and shows arithmetic result |
| `convertUnits(value, from, to, type)` | Converts a value from one unit to another |
| `convertTemp(val, from, to)` | Converts temperature values using formulas |
| `formatNum(n)` | Formats a number to clean readable format |
| `logout()` | Clears user session and goes back to login page |

---

## CSS Files

### auth.css
Styles for the login/signup page:
- `.card` — The white box in the center of the page
- `.brand` — The blue left side with the logo and app name
- `.form-section` — The right side with the form
- `.tabs` — Login/Signup tab buttons
- `.form-panel` — The login or signup form (only active one is shown)
- `.field` — Each input group (label + input + error)
- `.error-msg` — Red error text below inputs (hidden by default, shown with `.show` class)
- `.btn-submit` — The blue Login/Signup button
- `.password-wrap` — Wrapper for password input with eye icon

### dashboard.css
Styles for the main app page:
- `header` — Blue top bar with app name and logout button
- `.main` — Main content area
- `.section-title` — Small uppercase label like "CHOOSE TYPE"
- `.type-grid` — 4-column grid for type cards
- `.type-card` — Individual type card (Length, Weight etc)
- `.type-card.active` — Selected card with teal border
- `.action-row` — Row of 3 action buttons
- `.action-btn` — Individual action button
- `.action-btn.active` — Selected button with blue background
- `.panel` — Each action panel (hidden by default)
- `.panel.active` — Currently visible panel
- `.two-col` — Two column layout for inputs
- `.big-input` — Large number input box
- `.unit-select` — Unit dropdown below each input
- `.result-box` — Green left-bordered result area
- `.result-row` — Result text and unit dropdown side by side
- `.op-box` — Operator dropdown wrapper in Arithmetic

---

## How to Run
1. Open `index.html` in any browser
2. Signup with your details
3. Login and use the app

> No server needed. Everything runs in the browser.

---

## Technologies Used

- HTML
- CSS
- JavaScript (Vanilla, no frameworks)
- Google Fonts (Poppins)
- localStorage (for storing user data in browser)

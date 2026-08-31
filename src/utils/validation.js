export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isRequired = (value) =>
  typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null && value !== '';

export const minLength = (value, min) =>
  typeof value === 'string' && value.trim().length >= min;

export const isPhone = (value) => /^[+()\-\s0-9]{7,20}$/.test(value);

export const validateLogin = (values) => {
  const errors = {};
  if (!isRequired(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.password)) errors.password = 'Password is required.';
  return errors;
};

export const validateRegister = (values) => {
  const errors = {};
  if (!isRequired(values.name)) errors.name = 'Full name is required.';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!isRequired(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.password)) errors.password = 'Password is required.';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';
  return errors;
};

export const validateForgotPassword = (values) => {
  const errors = {};
  if (!isRequired(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  return errors;
};

export const validateCheckout = (values) => {
  const errors = {};
  if (!isRequired(values.email)) errors.email = 'Email is required.';
  else if (!isEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.firstName)) errors.firstName = 'First name is required.';
  if (!isRequired(values.lastName)) errors.lastName = 'Last name is required.';
  if (!isRequired(values.address)) errors.address = 'Address is required.';
  if (!isRequired(values.city)) errors.city = 'City is required.';
  if (!isRequired(values.postalCode)) errors.postalCode = 'Postal code is required.';
  if (!isRequired(values.phone)) errors.phone = 'Phone is required.';
  else if (!isPhone(values.phone)) errors.phone = 'Enter a valid phone number.';
  return errors;
};

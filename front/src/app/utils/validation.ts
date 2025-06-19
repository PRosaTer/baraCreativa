export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{7,20}$/;
  return phoneRegex.test(phoneNumber);
};
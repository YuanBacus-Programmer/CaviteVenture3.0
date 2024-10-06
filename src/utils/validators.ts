export function emailValidator(email: string): boolean {
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return emailRegex.test(email);
}

export function passwordValidator(password: string): boolean {
 // Ensure password is at least 8 characters, contains at least one number and one special character
 const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
 return passwordRegex.test(password);
}

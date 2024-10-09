import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Define an interface representing a User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  isVerified: boolean;
  profilePicture?: string;
  verificationCode?: string | null;
  verificationCodeExpires?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  passwordLastChanged?: Date; // Make sure this field is included
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  generateVerificationCode: () => string;
  generateResetPasswordToken: () => string;
}

// Define the user schema with timestamps
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'superadmin'],
    },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: '/placeholder-user.jpg' },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    passwordLastChanged: { type: Date }, // Include this field in the schema
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordLastChanged = new Date(); // Update passwordLastChanged whenever the password changes
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and set a new verification code
userSchema.methods.generateVerificationCode = function (): string {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
  this.verificationCode = verificationCode;
  this.verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour
  return verificationCode;
};

// Method to generate and set a password reset token
userSchema.methods.generateResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex'); // Generate random token
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the token
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
  return resetToken;
};

// Export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

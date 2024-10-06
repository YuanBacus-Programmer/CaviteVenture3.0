import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Define an interface representing a User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Explicitly set the type for _id
  updatedAt: Date;
  createdAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  isVerified: boolean;
  profilePicture?: Buffer; // Store the profile picture as a binary buffer
  verificationCode?: string | null;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  gender?: 'male' | 'female' | 'other'; // Optional new field
  location?: string; // Optional new field
  birthday?: Date; // Optional new field
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  generateVerificationCode: () => string;
  generateResetPasswordToken: () => string;
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'superadmin'] },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: Buffer, default: null }, // Store profile picture as binary data (Buffer)
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' }, // Optional gender field
    location: { type: String, default: '' }, // Optional location field with default empty string
    birthday: { type: Date }, // Optional birthday field
  },
  { timestamps: true } // Enable createdAt and updatedAt timestamps
);

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it's been modified or is new
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds); // Hash the password with bcrypt
    next();
  } catch (error) {
    next(error as mongoose.CallbackError); // Pass the error to the next middleware
  }
});

// Method to compare hashed passwords
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the stored hash
};

// Method to generate and set the verification code
userSchema.methods.generateVerificationCode = function (): string {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
  this.verificationCode = verificationCode;
  this.verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // Set expiration for 1 hour
  return verificationCode;
};

// Method to generate and set the password reset token
userSchema.methods.generateResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex'); // Generate random token
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash the token
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiration for 10 minutes
  return resetToken;
};

// Export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

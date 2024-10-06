'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeVerificationModal } from '@/components/Signup12/VerificationModal/CodeVerificationModal';
import { Button } from "@/components/Signup12/Ui/Button";
import { Input } from "@/components/Signup12/Ui/Input";
import { Label } from "@/components/Signup12/Ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Signup12/Ui/Select";
import { Checkbox } from "@/components/Signup12/Ui/CheckBox";
import { PrivacyPolicyModal } from '@/components/Signup12/Privacy/Privacy-Policy-Modal';
import { GoogleSignUpButton } from '@/components/Signup12/Google-Signup-Button';
import Image from 'next/image';
import Link from 'next/link';
import Cog from '@/assets/HeroImages/cog.png';

export default function SignUp() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [reenterPassword, setReenterPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== reenterPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    const formData = {
      firstName,
      lastName,
      email,
      password,
      gender,
      location,
    };

    try {
      const response = await fetch('/api/auth/signup/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('User created successfully! A verification code has been sent to your email.');
        setVerificationModalOpen(true);
      } else {
        setFormError(result.message || 'Something went wrong');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError('An error occurred');
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        alert('Verification successful! Redirecting to sign in.');
        setVerificationModalOpen(false);
        router.push('/signin');
      } else {
        alert('Invalid verification code.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('An error occurred during verification.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fae8b4', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        <g className="lines">
          {[...Array(20)].map((_, i) => (
            <path
              key={i}
              d={`M${-1000 + i * 100},0 Q${-500 + i * 100},${500 + Math.random() * 500} ${i * 100},1000`}
              stroke="#fae8b4"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            >
              <animate
                attributeName="d"
                dur={`${10 + Math.random() * 20}s`}
                repeatCount="indefinite"
                values={`
                  M${-1000 + i * 100},0 Q${-500 + i * 100},${500 + Math.random() * 500} ${i * 100},1000;
                  M${-1000 + i * 100},0 Q${-500 + i * 100},${1000 + Math.random() * 500} ${i * 100},1000;
                  M${-1000 + i * 100},0 Q${-500 + i * 100},${500 + Math.random() * 500} ${i * 100},1000
                `}
              />
            </path>
          ))}
        </g>
        <circle r="10" fill="#fae8b4">
          <animateMotion
            dur="20s"
            repeatCount="indefinite"
            path="M0,0 Q400,50 800,100 T1600,200"
          />
        </circle>
      </svg>

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#fae8b4]">
          Welcome to Cavite Venture
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-6">
          Explore the most amazing history of Cavite in your hand
        </p>
        <div className="w-full max-w-lg md:max-w-2xl mx-auto h-40 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={Cog}
            alt="Cavite Venture"
            width={160}
            height={110}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="w-full max-w-lg md:max-w-2xl space-y-8 bg-white bg-opacity-70 p-6 md:p-8 rounded-xl backdrop-blur-sm relative z-10 shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname" className="text-gray-700">First Name</Label>
              <Input
                id="firstname"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="lastname" className="text-gray-700">Last Name</Label>
              <Input
                id="lastname"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthday" className="text-gray-700">Birthday</Label>
            <Input id="birthday" type="date" required className="bg-white border-gray-300" />
          </div>

          <div>
            <Label htmlFor="gender" className="text-gray-700">Gender</Label>
            <Select onValueChange={setGender}>
              <SelectTrigger id="gender" className="bg-white border-gray-300">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-gray-700">Location</Label>
            <Select onValueChange={setLocation}>
              <SelectTrigger id="location" className="bg-white border-gray-300">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="binakayan">Binakayan</SelectItem>
                <SelectItem value="bacoor">Bacoor</SelectItem>
                <SelectItem value="cavitecity">Cavite City</SelectItem>
                <SelectItem value="rosario">Rosario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              required
              className="bg-white border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="reenterPassword" className="text-gray-700">Re-enter Password</Label>
            <Input
              id="reenterPassword"
              type="password"
              required
              className="bg-white border-gray-300"
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
            />
          </div>

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex items-center space-x-2">
            <Checkbox id="privacy" />
            <Label htmlFor="privacy" className="text-sm text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowPrivacyPolicy(true)}
              >
                Privacy Policy
              </button>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-[#fae8b4] text-gray-800 hover:bg-[#f5d78e]">
            Sign Up
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleSignUpButton />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/Signin" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <PrivacyPolicyModal isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
      </div>

      <CodeVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        onVerify={handleVerifyCode}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Signup12/Ui/Dialog";
import { Input } from "@/components/Signup12/Ui/Input";
import { Button } from "@/components/Signup12/Ui/Button";
import { Label } from "@/components/Signup12/Ui/Label";

interface CodeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

export function CodeVerificationModal({ isOpen, onClose, onVerify }: CodeVerificationModalProps) {
  const [code, setCode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code); // Pass the entered code to the parent component for verification
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-visible bg-transparent border-none shadow-none">
        <div className="relative">
          <div className="absolute -inset-4 bg-[#fae8b4] opacity-75 blur-lg rounded-lg animate-pulse"></div>
          <div className="relative bg-white p-8 rounded-lg shadow-xl z-10 border-2 border-[#fae8b4] animate-glow">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-[#fae8b4]">Verify Your Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                  Enter Verification Code
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 block w-full border-[#fae8b4] rounded-md shadow-sm focus:ring-[#fae8b4] focus:border-[#fae8b4]"
                  placeholder="Enter your 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#fae8b4] text-gray-800 hover:bg-[#f5d78e] animate-pulse">
                Verify
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

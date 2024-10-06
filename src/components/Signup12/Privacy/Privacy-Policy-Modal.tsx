import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/Signup12/Ui/Dialog"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            This is the privacy policy for Cavite Venture. Please read it carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
          <p className="mb-4">
            We collect personal information that you provide to us, such as your name, email address, and location.
          </p>

          <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
          <p className="mb-4">
            We use your information to provide and improve our services, communicate with you, and ensure the security of our platform.
          </p>

          <h3 className="text-lg font-semibold mb-2">3. Data Security</h3>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information.
          </p>

          <h3 className="text-lg font-semibold mb-2">4. Your Rights</h3>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.
          </p>

          <h3 className="text-lg font-semibold mb-2">5. Changes to This Policy</h3>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
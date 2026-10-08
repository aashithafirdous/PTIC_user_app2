import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const [identifier, setIdentifier] = useState('karthik.rajan@rajanpoultry.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier, password);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stakeholder Sign In"
      description="Enter your registered council credentials to access your personalized portal."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#135E69]/10 border border-[#135E69]/20 text-xs">
          <div className="flex items-center gap-2 text-[#135E69] dark:text-[#5ce0d2] font-semibold">
            <ShieldCheck size={16} />
            <span>Official Council Session</span>
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            Active Portal
          </span>
        </div>

        <Input
          label="Email / Username / Member ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="e.g. karthik.rajan@rajanpoultry.in"
          leftIcon={<User size={15} />}
          required
        />

        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          leftIcon={<Lock size={15} />}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-[#B3CFE5]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#135E69] accent-[#135E69]"
            />
            <span>Remember session</span>
          </label>

          <span className="text-xs font-semibold text-[#135E69] dark:text-[#5ce0d2] hover:underline cursor-pointer">
            Forgot Password?
          </span>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
          >
            Login
          </Button>
        </div>
      </form>
    </Modal>
  );
};

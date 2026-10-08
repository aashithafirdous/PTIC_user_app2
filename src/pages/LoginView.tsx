import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

export interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('karthik.rajan@rajanpoultry.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ptic-bg via-white to-ptic-soft/20 flex flex-col items-center justify-center p-4 sm:p-6 text-left antialiased select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Council Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-[16px] bg-ptic-primary text-white font-bold text-xl flex items-center justify-center shadow-card ring-4 ring-ptic-soft/30">
            PTIC
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <h1 className="text-xl font-bold text-ptic-dark tracking-tight">
                Poultry Technology & Innovation Council
              </h1>
            </div>
            <p className="text-xs text-ptic-secondary font-medium mt-0.5">
              Verified Stakeholder Portal · Secure Session
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[16px] border border-ptic-border shadow-card p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-ptic-border">
            <div>
              <h2 className="text-sm font-bold text-ptic-dark">
                Stakeholder Sign In
              </h2>
              <p className="text-[11px] text-ptic-textMuted mt-0.5">
                Enter your registered council credentials
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
              <CheckCircle2 size={12} /> Live Portal
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email / Phone / Stakeholder ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. karthik.rajan@rajanpoultry.in"
              leftIcon={<User size={15} />}
              required
            />

            <Input
              type="password"
              label="Password / Security PIN"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock size={15} />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-ptic-dark">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-ptic-primary accent-ptic-primary"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={onLogin}
                className="text-xs font-medium text-ptic-secondary hover:underline"
              >
                Request OTP
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full py-2.5 mt-2"
              rightIcon={<ArrowRight size={15} />}
            >
              Sign In to PTIC Portal
            </Button>
          </form>

          {/* Quick Demo Re-entry */}
          <div className="pt-3 border-t border-ptic-border">
            <p className="text-[11px] text-ptic-textMuted text-center mb-2.5">
              Quick demo authentication:
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="w-full flex items-center justify-between p-2.5 rounded-[12px] bg-ptic-bg hover:bg-ptic-soft/30 border border-ptic-border transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-ptic-primary text-white text-xs font-bold flex items-center justify-center">
                  {CURRENT_USER.initials}
                </div>
                <div>
                  <p className="text-xs font-bold text-ptic-dark">
                    {CURRENT_USER.name}
                  </p>
                  <p className="text-[10px] text-ptic-textMuted">
                    {CURRENT_USER.role} · {CURRENT_USER.organization}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-ptic-secondary">
                1-Click Sign In →
              </span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-ptic-textMuted flex items-center justify-center gap-1">
            <ShieldCheck size={13} className="text-ptic-secondary" />
            Protected by PTIC National Biosecurity Governance Standard
          </p>
          <p className="text-[10px] text-ptic-textMuted/70">
            Helpline: 1800-425-7842 · Secretariat: support@ptic-council.in
          </p>
        </div>
      </div>
    </div>
  );
};

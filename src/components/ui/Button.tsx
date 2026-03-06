import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#ffd700] text-[#0a0a0f] font-semibold hover:bg-[#ffe066] hover:shadow-[0_0_20px_rgba(255,215,0,0.4),0_0_40px_rgba(255,215,0,0.15)] active:scale-[0.98] transition-all duration-300 tracking-widest uppercase',
  secondary:
    'border border-[rgba(255,215,0,0.25)] text-[rgba(255,255,255,0.7)] bg-transparent hover:border-[rgba(255,215,0,0.5)] hover:text-white hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] active:scale-[0.98] transition-all duration-300',
  destructive:
    'bg-rose-900/30 text-rose-400 font-medium border border-rose-800/40 hover:bg-rose-900/40 hover:shadow-[0_0_15px_rgba(225,29,72,0.2)] active:scale-[0.98] transition-all duration-300',
  ghost:
    'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,215,0,0.06)] transition-all duration-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-5 py-2.5 text-sm rounded',
  lg: 'px-8 py-3 text-sm rounded',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

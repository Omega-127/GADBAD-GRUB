import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'nitro':
        return {
          background: 'var(--grad-nitro)',
          color: '#FFFFFF',
          boxShadow: '0 4px 15px rgba(255, 51, 102, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        };
      case 'gold':
        return {
          background: 'var(--grad-gold)',
          color: '#0A0E17',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(255, 184, 0, 0.35)',
          border: 'none',
        };
      case 'outline':
        return {
          background: 'rgba(255, 255, 255, 0.04)',
          color: 'var(--text-primary)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
        };
      case 'primary':
      default:
        return {
          background: 'var(--grad-primary)',
          color: '#FFFFFF',
          boxShadow: '0 4px 15px rgba(0, 240, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.85rem' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1.05rem', letterSpacing: '0.5px' };
      case 'md':
      default:
        return { padding: '10px 18px', fontSize: '0.95rem' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`speed-btn ${className}`}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-racing)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;

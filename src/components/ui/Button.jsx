import { forwardRef } from 'react'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled,
  loading,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-emerald-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg focus:ring-emerald-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg focus:ring-yellow-500',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
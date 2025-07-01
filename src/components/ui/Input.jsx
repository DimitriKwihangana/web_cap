import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
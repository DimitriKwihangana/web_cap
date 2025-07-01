import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
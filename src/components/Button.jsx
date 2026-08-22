function Button({ children, onClick, variant = 'primary', type = 'button' }) {
  return <button className={`button button-${variant}`} type={type} onClick={onClick}>{children}</button>
}

export default Button
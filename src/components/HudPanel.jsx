export default function HudPanel({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`relative border border-border bg-surface/60 ${className}`} {...props}>
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/60" />
      <span className="pointer-events-none absolute -right-px -bottom-px h-3 w-3 border-b border-r border-accent/60" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/30" />
      {children}
    </Tag>
  )
}

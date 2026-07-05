import { NavLink } from 'react-router-dom'

export default function SidebarNav({ items, activeClass = 'bg-surface text-primary', inactiveClass = 'hover:bg-surface/50' }) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
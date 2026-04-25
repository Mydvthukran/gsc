import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function IconResolver({ name, ...props }) {
  // If the icon is already a React element, just return it (fallback for legacy emojis passed as children)
  if (React.isValidElement(name)) {
    return name;
  }
  
  // If it's a string, try to find it in Lucide icons
  if (typeof name === 'string') {
    const IconComponent = LucideIcons[name];
    if (IconComponent) {
      return <IconComponent {...props} />;
    }
    // Fallback if the icon name is not found
    const FallbackIcon = LucideIcons['HelpCircle'];
    return <FallbackIcon {...props} />;
  }

  // Final fallback
  return null;
}

'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'



// Sidebar Component
interface SidebarProps {
  content: string;
}

export function Sidebar({ content }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [navigation, setNavigation] = useState<{ text: string; level: number; children: unknown[]; isOpen: boolean }[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const navItems: { text: string; level: number; children: unknown[]; isOpen: boolean }[] = [];
    const stack: { text: string; level: number; children: unknown[]; isOpen: boolean }[] = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      const navItem = { text: heading.textContent || '', level, children: [], isOpen: true };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(navItem);
      } else {
        navItems.push(navItem);
      }

      stack.push(navItem);
    });

    setNavigation(navItems);
  }, [content]);

  const renderNavItem = (item: { text: string; level: number; children: unknown[]; isOpen: boolean }, index: number) => (
    <div key={index} className="mb-2">
      <div className="flex items-center">
        {item.children.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              item.isOpen = !item.isOpen;
              setNavigation([...navigation]);
            }}
          >
            {item.isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        <span className="text-sm" style={{ marginLeft: `${(item.level - 1) * 0.5}rem` }}>
          {index} {item.text}
        </span>
      </div>
      {item.children.length > 0 && item.isOpen && (
        <div className="ml-4 mt-2">
          {item.children.map((child, childIndex) => renderNavItem(child as { text: string; level: number; children: unknown[]; isOpen: boolean }, parseFloat(`${index}.${childIndex + 1}`)))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white border-r transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
    {/* // <div className={` border-r transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}> */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className={`font-semibold ${isExpanded ? '' : 'hidden'}`}>Navigation</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      {isExpanded && (
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-4">
            {navigation.map((item, index) => renderNavItem(item, index + 1))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { parseHTML } from 'linkedom'

interface NavItem {
  text: string
  children?: NavItem[]
  isOpen?: boolean
}

export function generateNavigation(content: string): NavItem[] {
  const { document } = parseHTML(content)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const navigation: NavItem[] = []
  const stack: NavItem[] = []

  headings.forEach((heading: Element) => {
    const level = parseInt(heading.tagName[1])
    const navItem: NavItem = { text: heading.textContent || '', isOpen: true }

    while (stack.length >= level) {
      stack.pop()
    }

    if (stack.length > 0) {
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(navItem)
    } else {
      navigation.push(navItem)
    }

    stack.push(navItem)
  })

  return navigation
}


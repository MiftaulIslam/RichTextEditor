export function scrollSelectedItemIntoView(
    container: HTMLElement | null,
    selectedItem: HTMLElement | null,
    options: { behavior?: ScrollBehavior } = { behavior: "smooth" }
  ) {
    if (!container || !selectedItem) return;
  
    const containerRect = container.getBoundingClientRect();
    const selectedRect = selectedItem.getBoundingClientRect();
  
    const isAbove = selectedRect.top < containerRect.top;
    const isBelow = selectedRect.bottom > containerRect.bottom;
  
    if (isAbove) {
      selectedItem.scrollIntoView({ block: "start", behavior: options.behavior });
    } else if (isBelow) {
      selectedItem.scrollIntoView({ block: "end", behavior: options.behavior });
    }
  }
  
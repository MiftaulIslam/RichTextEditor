
// Button component for toolbar
export const ToolbarButton = ({ icon, isActive, onMouseDown }: { icon: React.ReactNode, isActive: boolean, onMouseDown: (e: React.MouseEvent) => void }) => {
  return (
    <button
      className={`p-2 mx-1 rounded ${isActive ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"}`}
      onMouseDown={onMouseDown}
    >
      {icon}
    </button>
  )
}


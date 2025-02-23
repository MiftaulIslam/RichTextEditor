/* eslint-disable @typescript-eslint/no-explicit-any */
export const SecondaryLoader = ({ color = "bg-black", size = 12 }:{color?:any, size?:any}) => {
    return (
      <div className="flex items-center space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`animate-bounce rounded-full ${color}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    )
  }
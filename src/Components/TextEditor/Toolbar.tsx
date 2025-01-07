
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { FC } from 'react';


// Toolbar Component
const Toolbar:FC<{
  isboldactive:boolean,
  isunderlineactive:boolean,
  isitalicactive:boolean,
  handlebold:()=>void,
  handleunderline:()=>void,
  handleitalic:()=>void,
  handlecontentleft:()=>void,
  handlecontentright:()=>void,
  handlecontentcenter:()=>void,
  handleorderlist:()=>void
  handleunorderlist:()=>void
  handleheading1:()=>void
  handleheading2:()=>void
  handleheading3:()=>void
}> = ({
  isboldactive,
  isunderlineactive,
  isitalicactive,  
  handlebold, 
  handleunderline, 
  handleitalic, 
  handlecontentleft, 
  handlecontentright, 
  handlecontentcenter,
  handleorderlist,
  handleunorderlist,
  handleheading1,  
  handleheading2,  
  handleheading3,
})=>{
  return (
    <div className="flex flex-wrap gap-2 p-2 border-b bg-white">
      <button className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out `} onClick={handlebold}>
        <Bold className={`${isboldactive ? 'h-5 w-5' : 'h-4 w-4 '}`}  />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out `} onClick={handleitalic}>
        <Italic className={`${isitalicactive ? 'h-5 w-5' : 'h-4 w-4 '}`} />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out `} onClick={handleunderline}>
        <Underline className={`${isunderlineactive ? 'h-5 w-5' : 'h-4 w-4 '}`} />
      </button>

      <button className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handleheading1} >
        <Heading1 className="h-4 w-4" />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handleheading2} >
        <Heading2 className="h-4 w-4" />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handleheading3} >
        <Heading3 className="h-4 w-4" />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handleunorderlist}>
        <List className="h-4 w-4" />
      </button>

      <button className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handleorderlist}  >
        <ListOrdered className='h-4 w-4'  />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handlecontentleft}>
        <AlignLeft className="h-4 w-4" />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handlecontentcenter}>
        <AlignCenter className="h-4 w-4" />
      </button>

      <button  className={`p-2 bg-transparent text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg transition-all duration-150 ease-in-out`} onClick={handlecontentright}>
        <AlignRight className="h-4 w-4" />
      </button>
    </div>
  );
} 
 
export default Toolbar;
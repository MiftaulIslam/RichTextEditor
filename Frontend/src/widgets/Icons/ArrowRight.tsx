import { FC } from "react"

const ArrowRight:FC<{
    width?: number,
    height?: number,
    classname?: string
}> = ({width, height, classname}) => {
  return (

    <svg className={classname} width={width ? width : 24} height={height?height:24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
  )
}

export default ArrowRight
import React from 'react'

function OuterContainer({children}) {
  return (
    <div className='w-[100%] '>
      <div className='w-[90%] mx-auto'>{children}</div>
    </div>
  )
}

export default OuterContainer
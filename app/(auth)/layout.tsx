import React from 'react'
import backgroundImg from "./login.jpg"

const AuthLayout =({children}:{children:React.ReactNode})=> {
  return (
    <div className="h-full flex items-center justify-center" style={{backgroundImage:`url(${backgroundImg})`}}>
        {children}
    </div>
  )
}

export default AuthLayout

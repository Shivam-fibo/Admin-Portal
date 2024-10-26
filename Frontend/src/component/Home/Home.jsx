import React, { useContext } from 'react'
import { Context } from '../../main'
import { Navigate } from 'react-router-dom'
import Login from '../Auth/Login'

const Home = () => {
    const {isAuthorized} = useContext(Context)
  if(!isAuthorized){
    return <Navigate to = {"/login"} />
  }

  
  return (
    <div>Home</div>
  )
}

export default Home
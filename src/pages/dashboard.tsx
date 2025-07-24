import React from 'react'
import { auth } from '@/lib/auth/index';

 function dashboard() {
  const prueba = async()=>{
    const session = await auth;
    console.log(session);
  }
prueba();

  return (
    <div>dashboard</div>
  )
}
export default dashboard;
import React, { useEffect } from 'react'
import CardWithForm from '../components/new'
import Newtoast from '../components/newtoast';

const LoginPage = () => {
      useEffect(() => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.className = "show";
      setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }
  }, []);
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <CardWithForm />
            <Newtoast
                message='Login Succesfull'
            />
        </div>
    )
}
export default LoginPage;

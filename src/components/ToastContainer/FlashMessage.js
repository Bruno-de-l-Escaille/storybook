import React from 'react';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const FlashMessage =({Toastf, status})=>{

  return (
    <div >
      <ToastContainer draggable={true} autoClose={false}/>
    </div>
  );
}

export const Toastf = toast ;


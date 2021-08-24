import React from 'react';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ToastContainer.scss";
import classnames from "classnames";

export const FlashMessage =({})=>{

  return (
    
    <div >
      <ToastContainer hideProgressBar={true}  /> 
    </div>
  );
}

export const Toast= {
  error : (message) => {
    toast.error(<Mycomponent title="Error" message={message} icon="icon-check" />);
  },
  success : (message) => {
    toast.success(<Mycomponent title="Success" message={message} icon="icon-check" />);
  },
  warning : (message) => {
    toast.warn(<Mycomponent title="Warning" message={message} icon="icon-power" />);
  }
}



export const Mycomponent =({title, message, icon})=>{

    return (
      
      <div >
           <i className={icon} />
            <div className="body">
              <h5>{title}</h5>
              <p>{message}</p>
            </div>
      </div>
    );
  }





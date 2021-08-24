import React, { Component , useEffect, useState} from "react";
import styles from "./Flashmessage.module.scss";
import classnames from "classnames";

 export const Flashmessage = ({openFlash, message, status, title, time})=> {
 
  let statusIcon = "icon-close";
  const [open, setOpen] = useState(openFlash);

  if(title){
    title = "error";
  }

  switch (status) {
    case "ERROR":
      statusIcon = "icon-close";
      break;
    case "WARNING":
      statusIcon = "icon-power";
      break;

      case "SUCCESS":
      statusIcon = "icon-check";
      break;
    default:
  }


  const changeopen=()=>{
    setOpen(!open);
  }

  const changeop=()=>{
    setOpen(true);
  }

  

  useEffect(() => {
    const timer = setTimeout(() => {
      (open && changeopen())
    }, time);
    return () => clearTimeout(timer);
  }, [openFlash]);
   
        return (
          <div
            className={classnames(
              styles.flashMessage,
              styles[status.toLowerCase()],
              open ? styles.opened : ""
            )}
          >
            
            <i className={classnames("icon", statusIcon)} />
            <div className={styles.body}>
              <h5>{title}</h5>
              <p>{message}</p>
            </div>

            <span className={classnames("icon-close")} onClick={()=>setOpen(false)}> </span>
            
          </div>
        );
      
  };



  export const Taost = (chaine)=>{
   
        return(
         <div>
         <Flashmessage openFlash={true}  message="message success" status="SUCCESS" title="success" time={3000}/> 
         </div>
        );
      

      
      
};






import React, { useEffect } from 'react'
import styles from "../css/toast.module.css"

const Newtoast = ({ message }: { message: string }) => {
  //   useEffect(() => {
  //   const toast = document.getElementById("toast");
  //   if (toast) {
  //     toast.className = "show";
  //     setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
  //   }
  // }, []);
  return (
      <div id={styles.toast}>{message}</div>
  )
}

export default Newtoast;

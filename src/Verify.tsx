import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2'

import './index.css'
declare global {
  interface Window {
    clipboardData: any;
  }
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const Verify: React.FC = () => {

  let history = useHistory();

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const notify = (status: any, message: String) => {
    Toast.fire({
      icon: status,
      title: message
    })
  }
  const handleChange = ((element: any, index: Number) => {
    const value = element.value.trim()
    if (isNaN(value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);
    //Focus next input
    if (element.nextSibling && !isNaN(value) && !!value) {
      element.nextSibling.focus();
    }

  });


  const handlePaste = (eventData: any) => {
    eventData.stopPropagation();
    eventData.preventDefault();
    let paste = (eventData.clipboardData || window.clipboardData).getData('text').trim();

    let pasteArray = Array.from(paste);
    let pasteIndex = 0;

    setOtp([...otp.map((d) => (d !== "" ? d : pasteArray[pasteIndex++] ?? ''))]);

    const els = document.querySelectorAll('input');


    const emptyIndex = otp.indexOf("");


    const activeIndex = pasteArray.length + (emptyIndex >= 0 ? emptyIndex : 100);


    if (els[activeIndex] ?? false)
      els[activeIndex].focus();
    else if (activeIndex >= els.length)
      els[els.length - 1].focus();

  };

  console.log(otp)




  const handelSubmit = async (event?: React.FormEvent) => {

    notify('info', 'Please wait !!')

    event?.preventDefault();

    const getError = document.querySelectorAll('.error');

    if (getError.length && otp.join('').length === 6) {
      notify('error', 'Invalid Input')
    } else {
      const resp = await fetch("https://api.baahrakhari.de/otp", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          otp: otp.join(''),
        }),
      })
      const res = await resp.json();

      if (res.status === "success") {
        notify(res.status, res.message)
        history.push('/success');
      }
      else
        notify(res.status, res.message)

    }
  }

  return (
    <div className="container">
      <div className="wrapper">
        <h3>Verification Code:</h3>
        <form method="POST" onSubmit={e => handelSubmit(e)}  >
          <div className="form">
            {otp.map((data, index) => {
              return (
                <input
                  type="text"
                  maxLength={1}
                  className={isNaN(data) ? 'error' : ''}
                  size={1}
                  min="0"
                  max="9"
                  pattern="[0-9]{1}"
                  key={index}
                  value={data}
                  onPaste={e => handlePaste(e)}
                  onChange={e => handleChange(e.target, index)}
                  required
                // onFocus={e => e.target.select()}
                />
              );
            })}
          </div>
          <div className="button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;

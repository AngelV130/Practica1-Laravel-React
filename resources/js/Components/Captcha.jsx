import React, { useEffect, useState } from 'react';

const MyComponent = ({setData,error}) => {
  const [state, setState] = useState(false)
  const [opt_widget_id , setw] = useState(null)
  useEffect(() => {
    const loadRecaptchaScript = () => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
          setState(true)
      };
    };

    loadRecaptchaScript();
  }, []);

  useEffect(()=>{
    if(state){
      window.grecaptcha.ready(() => {
        opt_widget_id != null && grecaptcha.reset(opt_widget_id)
        setw(
          window.grecaptcha.render('contenedor-recaptcha', {
            sitekey: '6LdQ7F0pAAAAAMb2vICxr89p1srjijesx1HKl73A',
            callback: (response) => {
              setData(response)
            },
          })
        )
      })
    }
  },[error,state])

  return (
    <>
      <div id="contenedor-recaptcha" className="g-recaptcha"></div>
    </>
  );
};

export default MyComponent;
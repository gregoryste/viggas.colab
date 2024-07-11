var onloadCallback = function() {
    document.querySelectorAll("#js-recaptcha").forEach(function(el){
        grecaptcha.render(el, {
            'callback':(response) =>{
                const parentElement = el.parentNode.parentNode;
                parentElement.querySelector(".js-button-captcha").disabled = false;
             },
             'expired-callback': () =>{
                const parentElement = el.parentNode.parentNode;
                parentElement.querySelector(".js-button-captcha").disabled = true;
             },
           'sitekey' : el.dataset.key
         });

    })
};
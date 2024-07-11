const form = document.querySelector(".js-form-contact");
const buttonContact = document.querySelector(".js-contact-submit");
const inputName = document.querySelector(".js-name");
const inputEmail = document.querySelector(".js-email");
// const checkboxTerms = document.querySelector(".js-input-lgpd")
const itemsError = document.querySelectorAll(".js-field-item")
const errors = document.querySelectorAll(".js-error-message")


if(buttonContact){
    buttonContact.addEventListener("click", function() {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        removeMessageError()

        if(inputName.value.trim() == ""){
            showMessageError(".js-name", "Campo obrigatório")
            return
        }

        if(inputEmail.value.trim() == ""){
            showMessageError(".js-email", "Campo obrigatório")
            return
        }

        if(!inputEmail.value.match(regex)){
            showMessageError(".js-email", "E-mail inválido")
            return
        }

        // if(!checkboxTerms.checked){
        //     alert("Aceite os termos de privacidade");
        //     return
        // }

        form.submit();
    })
}

function showMessageError(field, msg){
    const input = document.querySelector(field);
    const container = input.parentNode

    container.classList.add("error");

    var spanElement = document.createElement("span");
    spanElement.textContent = msg;
    spanElement.setAttribute("class", "error-message js-error-message");
    container.appendChild(spanElement);
}

function removeMessageError(){
    itemsError.forEach(function(e){ 
        e.classList.remove("error")
        if(e.children[1]) e.children[1].remove();
    });
}
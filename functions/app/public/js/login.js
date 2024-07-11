let iconInvisible = document.querySelector(".js-eye-invisible"),
    iconVisible = document.querySelector(".js-eye");

// Manipulacao para exibir/esconder senha
iconInvisible.addEventListener("click", () => {
    document.querySelector('.js-input-passowrd').type = "text";
    iconInvisible.style.display = "none";
    iconVisible.style.display = "block";
})

iconVisible.addEventListener("click", () => {
    document.querySelector('.js-input-passowrd').type = "password";
    iconInvisible.style.display = "block";
    iconVisible.style.display = "none";
})
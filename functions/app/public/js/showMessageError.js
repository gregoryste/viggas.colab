const buttonExit = document.querySelectorAll(".js-toast-item");
const form = document.querySelector(".js-form-errors");
const baseURL = window.location.protocol + '//' + window.location.host;

if(form){
  form.setAttribute("action", `${baseURL}/clear-errors`);
}

buttonExit.forEach(function(item){
    item.addEventListener("click", function(){
        postData(`${baseURL}/clear-errors`, {});
        this.remove();
    })
})

function postData(url, data, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  
  const postData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  
  xhr.send(postData);
}
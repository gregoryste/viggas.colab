import { CountUp } from 'https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.js'

function countStart(){
  const $counters = document.querySelectorAll(".js-counter-value"),
        options = {
          useEasing: true,
          useGrouping: true,
          separator: ",",
          decimal: ".",
          speed: 50
        };

  $counters.forEach( (item) => {
    const value = item.dataset.count;

    if(value === ",") {
      item.innerHTML = value;
      item.classList.add("our-reach__counter-value-special");
      return
    } 

    const counter = new CountUp(item, value, options);
    counter.start();
  });
}

new Waypoint({
  element: document.querySelector('.our-reach'),
  handler: function() {
    countStart()
    //this.destroy() //for once
  },
  offset: '50%'
});
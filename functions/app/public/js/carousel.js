var swiper = new Swiper(".js-carousel-partners", {
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    navigation: {
        nextEl: ".js-button-next",
        prevEl: ".js-button-prev",
    },
    loop: true,
    breakpoints: {
        // when window width is >= 320px
        768: {
          slidesPerView: 4.5,
        },
      }
});

var swiper = new Swiper(".js-persons-viggas", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
      nextEl: ".js-button-next",
      prevEl: ".js-button-prev",
  },
  loop: true,
  breakpoints: {
      992: {
        slidesPerView: 5,
      },
    }
});

  
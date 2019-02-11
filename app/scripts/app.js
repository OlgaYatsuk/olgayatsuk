// import 'slick-carousel';
import 'owl.carousel';

import Scroll from './anchor-scroll'
import Form from './form-success'

Scroll();
Form();

$(function () {
  $('.js-nav-btn').on('click', showMenu);
  $('.js-close').on('click', hideMenu);

  function showMenu() {
    $('.js-nav').addClass('is-visible');
  }

  function hideMenu() {
    $('.js-nav').removeClass('is-visible');
  }
});

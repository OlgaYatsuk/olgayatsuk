const Scroll = () => {
  const $root = $('body,html');
  const $link = $('.js-nav-link');
  const $nav = $('.js-nav');

  $link.on('click', scrollToBlock);

  function scrollToBlock(e) {
    e.preventDefault();
      const id = $(this).attr('href');
      const top = $(id).offset().top + 70;
      $root.animate({scrollTop: top}, 800);

      $link.removeClass('is-active');
      $(this).addClass('is-active')

    $nav.removeClass('is-visible');


  }

};

export default Scroll;

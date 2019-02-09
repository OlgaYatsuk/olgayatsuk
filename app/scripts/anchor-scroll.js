const Scroll = () => {
  const $root = $('body,html');
  const $link = $('.js-nav');

  $link.on('click', scrollToBlock);

  function scrollToBlock(e) {
    e.preventDefault();
      const id = $(this).attr('href');
      const top = $(id).offset().top;
      $root.animate({scrollTop: top}, 800);

      $link.removeClass('is-active');
      $(this).addClass('is-active')
  }

};

export default Scroll;

const Form = () => {
  const $form = $('.js-form')
  const $successModal = $('.js-form-success');
  const $closeModal = $('.js-form-success-close');

  $form.on('submit', showModal);
  $closeModal.on('click', hideModal);

  function showModal(e) {
    e.preventDefault();
    $successModal.fadeIn();
  }

  function hideModal(e) {
    e.preventDefault();
    $successModal.fadeOut()
  }
};

export default Form;

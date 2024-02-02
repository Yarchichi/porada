const validations = {
  name: function (str) {
    return str.length >= 5
  },
  message: function (str) {
    return str.length >= 5
  },
  phone: function (str) {
    return /(?=(^([^\d]*?\d){10,12}$))/.test(str)
  }
};

function stripFromString (stripPattern, string) {
  const reg = new RegExp(stripPattern, 'g')

  return string.replace(reg, '')
};
function isValid ($inputs) {
  let valid = true

  $inputs.each(function () {
    const $input = $(this)
    const required = $input.prop('required')
    const validate = $input.data('validate')
    const stripPattern = $input.data('strip')
    const val = stripPattern ? stripFromString(stripPattern, $input.val()) : $input.val()

    if (required && (val === undefined || validate && validations[validate] && !validations[validate](val))) {
      $input.addClass('is-invalid')
      valid = false
      return false
    }
  })

  return valid
};

$(document).ready(function () {
  $('.toggleMenu').on('click', function () {
    $('.burger').toggleClass('active')
    $('.burger').toggleClass('zoomInUp')
    $('body').toggleClass('menu_opened')
    $('.menu').toggleClass('active')
    $('.header-contacts-social').toggleClass('d-n')
  })

  $('.about-institution-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    autoplay: false,
    appendArrows: '.about-institution-slider-wrap >.slick-arrow-wrap >div'
  })

  $('.partners-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    appendArrows: '.partners-slider-wrap >.slick-arrow-wrap >div',
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000
  })

  $('.about-institution-slider').on('init reInit afterChange', function (e, slick, currentSlide) {
    $('.count-slide').text((String(slick.slideCount).padStart(2, '0')))

    $(this).closest('.about-institution-slider-wrap')
      .find('.current-slide').text((String(currentSlide + 1).padStart(2, '0') + '/'))
  })

  $('.partners-slider').on('init reInit afterChange', function (e, slick, currentSlide) {
    $('.count-slide').text((String(slick.slideCount).padStart(2, '0')))

    $(this).closest('.partners-slider-wrap')
      .find('.current-slide').text((String(currentSlide + 1).padStart(2, '0') + '/'))
  })

  $('.question-item .question-more-js').on('click', function (e) {
    e.preventDefault()
    const $this = $(this)
    const itemWrap = $this.closest('.question-item')
    const isActive = itemWrap.hasClass('active')

    $('.question-item').removeClass('active')
    $('.question-more-js').text('+')

    if (!isActive) {
      itemWrap.addClass('active')
      $this.text('-')
    }
  })

  $('[name="phone"]').mask('+38 (099) 999-99-99')

  $('[type="checkbox"]').on('change', function () {
    $('.form button').prop('disabled', !$(this).is(':checked'))
  })

  $('.form').on('submit', function (e) {
    e.preventDefault()

    const $form = $(this)
    const $inputs = $form.find('.userInput')

    $inputs.removeClass('is-invalid')

    const valid = isValid($inputs)
    
    if (!valid) return false

    const name = $(`[name="name"]`).val().trim(),
          tel = $(`[name="phone"]`).val().trim(),
          message = $(`[name="message"]`).val().trim();
    
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/users/',
      type: 'POST',
      method: $form.attr('method'),
      cache: 'false',
      data: {'name': name, 'tel': tel, 'message': message},
      dataType: 'html',
      success: function(data){
        localStorage.setItem('users', JSON.stringify([data]));
        $form.trigger("reset");
        alert('Дані відправлені')
        // $('.fancybox-form').fancybox({
        //   'titleShow'  : false,
        //   'autoscale' : true,
        //   'width'  : '450',
        //   'height'  : '700',
        //   'transitionIn'  : 'elastic',
        //   'transitionOut' : 'elastic',
        //   'text' : 'Дані відправлено'
        // })
        if(!data) alert("ERROR");
      }
    });

  })
})

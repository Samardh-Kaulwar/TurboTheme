/*jshint esversion: 6 */

/* eslint-disable */
//document ready
$(function() {
  utils.enableDisclosure();
  var oldFlickityCreate = window.Flickity.prototype._create;

  window.Flickity.prototype._create = function(){
    var that = this;
    if(this.element.addEventListener){
      this.element.addEventListener('load', function(){
        that.onresize();
      }, true);
    }
    this._create = oldFlickityCreate;
    return oldFlickityCreate.apply(this, arguments);
  };

  // Support for background images with new Lazysizes library
  document.addEventListener('lazyloaded', function(e){
    var bg = e.target.getAttribute('data-bg');
    var mobile_bg = e.target.getAttribute('data-mobile-bg');

    if(bg){
      if (Shopify.media_queries.medium.matches && mobile_bg) {
        bg = mobile_bg;
      }

      e.target.style.backgroundImage = 'url(' + bg + ')';
    }
  });

  // Call to flickity fix for sliders on IOS
  imageFunctions.flickityIosFix();

  objectFitImages();
  header.loadMegaMenu();
  header.init();
  if (Shopify.theme_settings.enable_autocomplete){
    searchAutocomplete.init();
  }
  utils.pageBannerCheck();
  slideshow.init();
  testimonial.init();
  videoSection.init();
  gallery.init();
  videoFeature.setupVideoPlayer();
  featuredPromotions.init();
  featuredCollectionSection.init();
  collectionSidebarFilter.init();
  cart.init();
  mapFunction.init();
  productPage.init();
  recentlyViewed.init();

  if (Currency.show_multiple_currencies || Currency.native_multi_currency) {
    currencyConverter.init();
  }

  // Challenge page scroll

  // Return the pathname of the current URL
  var pathname = location.pathname;

  // If the pathname starts with '/challenge', animate scroll
  if(pathname.startsWith('/challenge')) {
    $('html, body').animate({
      scrollTop: 0
    }, 'slow' );
  }

  // Product review scroll
  utils.productReviewScroll();

  // Setup a timer
  var resizeTimeout;
  // Grab screen width before screen is resized
  var beforeResizeWidth = $(window).width();

  // Listen for resize events
  window.addEventListener('resize', function ( event ) {

    // If timer is null, reset it to 66ms and run your functions.
    // Otherwise, wait until timer is cleared
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {

        // Reset timeout
        resizeTimeout = null;
        // Grab screen width after screen is resized
        var currentScreenWidth = $(window).width();
        // Run our resize functions
        if(Shopify.media_queries.medium.matches && currentScreenWidth !== beforeResizeWidth) {
          cart.init();
          header.unload();
          header.init();
        }

        // swap lazysizes background mobile images when browser is resized
        var lazysizesBackgroundImages = document.querySelectorAll('[data-bg]');
        lazysizesBackgroundImages.forEach((image) => {
          var bg = image.getAttribute('data-bg');
          var mobile_bg = image.getAttribute('data-mobile-bg');

          if(bg){
            if (Shopify.media_queries.medium.matches && mobile_bg) {
              bg = mobile_bg;
            }

            image.style.backgroundImage = 'url(' + bg + ')';
          }
        })

      }, 66);
    }
  }, false);

  //Lightbox default options
  //https://fancyapps.com/fancybox/3/docs/#options
  $.fancybox.defaults.animationEffect = 'fade';
  $.fancybox.defaults.transitionEffect = 'fade';
  $.fancybox.defaults.hash = false;
  $.fancybox.defaults.infobar = false;
  $.fancybox.defaults.toolbar = false;
  $.fancybox.defaults.arrows = false;
  $.fancybox.defaults.loop = true;
  $.fancybox.defaults.smallBtn = true;
  $.fancybox.defaults.live = false;
  $.fancybox.defaults.zoom = false;
  $.fancybox.defaults.mobile.preventCaptionOverlap = false;
  $.fancybox.defaults.mobile.toolbar = true;
  $.fancybox.defaults.mobile.buttons = ['close'];
  $.fancybox.defaults.mobile.clickSlide = 'close';
  $.fancybox.defaults.mobile.clickContent = 'zoom';
  $.fancybox.defaults.afterLoad = function(instance, slide) {
    if (instance.current.type == 'image'){
      slide.$content.wrapInner( "<div class='fancybox-image-wrap'></div>" )
    }
    if (instance.group.length > 1){
      slide.$content.find('.fancybox-image-wrap').append('<a title="Previous" class="fancybox-item fancybox-nav fancybox-prev" href="javascript:;" data-fancybox-prev><span>'+ svgArrowSizeLeft +'</span></a><a title="Next" class="fancybox-item fancybox-nav fancybox-next" href="javascript:;" data-fancybox-next><span>'+ svgArrowSizeRight +'</span></a>')
    }
  }

  //backwards compatibility with custom lightboxes
  $('.lightbox[rel="gallery"]').fancybox();

  // Find youtube and vimeo iframes
  var $videoIframes = $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"], iframe[src*="facebook.com/plugins/video"]');

  // For each iframe, if parent is a responsive video wrapper do nothing
  // If no parent responsive video wrapper, then wrap iframe in responsive video wrapper

  function getAspectRatio(width, height) {
    var ratio = width / height;

    //Determine ratio to be used
    if(Math.abs( ratio - 1 / 1 ) == 0) {
      return '1:1';
    } else {
      return ( Math.abs( ratio - 4 / 3 ) < Math.abs( ratio - 16 / 9 ) ) ? '4:3' : '16:9';
    }
  }

  $videoIframes.each(function(index, iframe) {

    // Update selector
    var $iframe = $(iframe);

    // Grab src
    var source = $iframe.attr('src');

    if (!$iframe.parents('.plyr__video-wrapper').length && !$iframe.parents('.lazyframe').length) {
      $iframe.wrap('<div class="lazyframe" data-ratio="'+ getAspectRatio($iframe.attr('width'), $iframe.attr('height'))  +'" data-src="' + source + '"></div>');
    }
  })

  // Initiate lazyframe
  lazyframe('.lazyframe');

  // Wrap shopify policy in grid layout classes
  $('.shopify-policy__container').wrap('<section class="section shopify-policy-template"><div class="container content"></div>');

  // Prevent header overlap on dynamically generated policy pages. Add pagecontent tag to match current page structure.
  $('.shopify-policy__container').closest('.section').prepend('<a name="pagecontent" id="pagecontent"></a>');

  //Add classes to determine column size
  $('.shopify-policy__container').addClass('five-eighths offset-by-three columns is-hidden-offset-mobile-only medium-down--one-whole');

  //Add featured divider beneath page title
  $('.shopify-policy__title').append('<div class="feature_divider"></div>');

  //Search input hiding
  //get current input
  var currentValue = $(".search__form input[name='q']").val()
  //return amount without *
  if ($(".search__form input[name='q']").length > 0){
    $(".search__form input[name='q']").val( currentValue.replace('*', '') );
  }

  $('#sort-by').val($('#sort-by').data('default-sort'));

  $('body')
    .on('change', '#sort-by', function() {
      quickFilter.init();
  });

  $('body')
    .on('change', '#tag_filter', function() {
      $('[data-option-filter] input').prop('checked', false);
      quickFilter.init();
  });

  $('body')
    .on('change', '#blog_filter', function() {
      var url = $(this).val();
      window.location = url;
  });

  $('input, select, textarea').on('focus blur', function(event) {
    $('meta[name=viewport]').attr('content', 'width=device-width,initial-scale=1,maximum-scale=' + (event.type == 'blur' ? 10 : 1));
  });

  //Collection sidebar filter
  //Check the checkbox values
  $('body').on('change', '[data-option-filter] input', function(){
    quickFilter.init();
    $("html, body").animate({
      scrollTop: ($('#pagecontent').offset().top)
    }, 500);
  })

  $('body').on('click', '[data-reset-filters]', function(){
    collectionSidebarFilter.clearAllFilters();
  });

  $('body').on('click', '[data-clear-filter]', function(){
    var selectedOption = $(this).parents('.filter-active-tag');
    collectionSidebarFilter.clearSelectedFilter(selectedOption);
  });

  $('body').on('change', '.currencies', function(e) {
      $('[data-initial-modal-price]').attr('data-initial-modal-price', '');
  });

  $('body').on('change', '.js-quick-shop select', function(e) {
      var currentVariant = $('.js-quick-shop select[name="id"]').val();
      if (currentVariant && globalQuickShopProduct){
        quickShop.updateVariant(currentVariant);
      }
  });

  if (Shopify.theme_settings.quick_shop_enabled){
    quickShop.init();
  }

  var touchStartPos = 0;

  //Detecting swipe vs tap
  $(document).bind("touchstart", function (e) {
    touchStartPos = $(window).scrollTop();
  }).bind("touchend", function (e) {
      var distance = touchStartPos - $(window).scrollTop();
      if (distance > 20 || distance < -20) {
          e.preventDefault;
      }
  });

  $('body').on('click', '.sidebar .parent-link--false', function(e) {
    e.preventDefault();
    $menu = $(this).parent('li');
    $menu.find('.menu-toggle').toggleClass('active');
    $menu.find('ul').slideToggle();
  });

  if (Shopify.theme_settings.newsletter_popup){
    newsletter_popup.init();
  }

  if(window.location.pathname.indexOf('/comments') != -1) {
    $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
  }

  $('body').on('mouseenter', '.icon-search', function() {
    $('.search-terms').focus();
  });

  $('body').on('click', '.icon-search', function() {
    $('input.search-terms').focus();
  });

  $('body').on('click', '.search-submit', function() {
    $(this).parent().submit();
  });

  if (Shopify.media_queries.large.matches) {
    $(".animate_right").waypoint(function() {
      $(this.element).addClass("animated fadeInRight");
    }, { offset: '70%' });
    $(".animate_left").waypoint(function() {
      $(this.element).addClass("animated fadeInLeft");
    }, { offset: '70%' });
    $(".animate_up").waypoint(function() {
      $(this.element).addClass("animated fadeInUp");
    }, { offset: '70%' });
    $(".animate_down").waypoint(function() {
      $(this.element).addClass("animated fadeInDown");
    }, { offset: '70%' });
  }

  //backwards compatibility with flexslider
  $('.slider, .flexslider').find('li').unwrap();
  $('.slider, .flexslider').flickity({
    pageDots: usePageDots,
    imagesLoaded: true,
    arrowShape: arrowSize,
    lazyLoad: 2
  });

  utils.createAccordion('.toggle-all--true', 'h4.toggle', 'ul.toggle_list');
  utils.createAccordion('.footer_menu', 'h6', 'ul');
  utils.createAccordion('.footer_content', 'h6', 'div.toggle_content');
  utils.createAccordion('.product_section .accordion-tabs', '.tabs li > a', '.tabs-content li');

  utils.mobileParentActiveAccordion('#mobile_menu', 'li.sublink > a.parent-link--true span', 'li.sublink ul');
  utils.mobileAccordion('#mobile_menu', 'li.sublink > a.parent-link--false', 'li.sublink ul');

  utils.initializeTabs();
  globalAccordions.init();

  //Sidebar toggle check
  if (Shopify.media_queries.medium.matches) {
    utils.createAccordion('.toggle-all--false', 'h4.toggle', 'ul.toggle_list');
  }

  $('body').on('click', '.menu-toggle', function(e) {
    var $content = $(this).next('ul');
    $content.slideToggle();
    $(this).toggleClass('active');
    $(this).attr('aria-expanded', $(this).attr('aria-expanded') == 'true' ? 'false' : 'true');
  });

  if (Shopify.theme_settings.collection_swatches){
    if (Shopify.media_queries.large.matches) {
      $('body').on('mouseenter', '.collection_swatches', function() {
        $('.swatch span', $(this)).each(function() {
          if($(this).data("image").indexOf("no-image") == -1) {
            $('<img/>')[0].src = $(this).data("image");
          }
        });
      });
      $('body').on('mouseenter', '.swatch span', function() {
        if($(this).data("image").indexOf("no-image") == -1) {
          $(this).parents('.thumbnail').find('.image__container img:not(.secondary)').attr('src', $(this).data("image"));
          $(this).parents('.thumbnail').find('.image__container img:not(.secondary)').attr('srcset', $(this).data("image"));
        }
      });
    }
  }

  //Terms of service settings for minicart
  if (Shopify.theme_settings.display_tos_checkbox){
    $('body').on('click touchstart', '.cart_content .tos_label', function() {
      $(this).prev('input').prop('checked', true);
    });
  }

  if (Shopify.theme_settings.display_tos_checkbox && Shopify.theme_settings.go_to_checkout){
    //Terms of service on mini-cart && cart page
    $('body').on('click', ".tos_warning [data-cart-checkout-button]", function(e) {
      if ($(this).parents('form').find('.tos_agree').is(':checked')) {
        // Check if we are on the cart page or mini cart
        if (Shopify.theme_settings.go_to_checkout || $('body').hasClass('cart')){
          $(this).submit();
        } else {
          // Redirect to cart page
          e.preventDefault();
          document.location.href = Shopify.routes.cart_url;
        }
      } else {
        var warning = '<p class="warning animated bounceIn">' + Shopify.translation.agree_to_terms_warning + '</p>';
        if ($('p.warning').length == 0) {
          $(this).before(warning);
        }
        return false;
      }
    });
  } else if (!Shopify.theme_settings.go_to_checkout){
    $('body').on('click', ".cart_content [data-minicart-checkout-button]", function(e) {
      // Redirect to cart page
      e.preventDefault();
      document.location.href = Shopify.routes.cart_url;
    });
  }


  if (Shopify.theme_settings.collection_secondary_image){
    imageFunctions.showSecondaryImage();
  }

  // Contact form checkbox validation
  if ($('[data-is-required]').length){
    var $checkboxGroup = $('.contact-block--checkbox input');
    $checkboxGroup.prop('required', true);

    $('.contact-block--checkbox [data-is-required] input').on('change', function(){
      $checkboxGroup.prop('required', true);
      if ($checkboxGroup.is(":checked")) {
        $checkboxGroup.prop('required', false);
      }
    })
  }

  $('.maps').click(function () {
    $('.maps iframe').css("pointer-events", "auto");
  });

  if (Shopify.theme_settings.pagination_type == 'load_more_button' ){
    enableLoadMoreButton('.collection-matrix');
  }

  if (Shopify.theme_settings.pagination_type == 'load_more' ){
    enableLoadMoreProducts();
  }

  if (Shopify.theme_settings.pagination_type == 'infinite_scroll'){
    enableInfiniteScroll();
  }

  if (Shopify.theme_settings.search_pagination_type == 'load_more_button' ){
    enableLoadMoreButton('.search-matrix');
  }

  if (Shopify.theme_settings.search_pagination_type == 'load_more' ){
    enableLoadMoreSearch();
  }

  if (Shopify.theme_settings.search_pagination_type == 'infinite_scroll' ){
    enableInfiniteSearchScroll();
  }

  /*============================================================================
    Start of cart-related functionality
  ==============================================================================*/

  function ajaxSubmitCart(cart) {
    $cart = cart;
    $.ajax({
      url: '/cart/update.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: $cart.serialize(),
      success: function (data) {
        refreshCart(data);
      }
    });
  }

  function updateCartItemQuantity(cartItem) {
    $.ajax({
      url: '/cart/change.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: {
        quantity: cartItem.quantity,
        line: cartItem.lineID
      },
      success: function (data) {

        var cartItemsArray = data.items;
        var lineIDIndex = cartItem.lineID - 1;
        var totalCartItems = cartItem.parentCartForm.find('[data-variant-id]').length;
        var $quantityInputs = cartItem.parentCartForm.find('[data-variant-id="' + cartItem.variantID + '"] input');
        var initialQuantityTotal = 0;
        var apiQuantityTotal = 0;
        var apiLineItemQuantity = typeof data.items[lineIDIndex] !== 'undefined' ? data.items[lineIDIndex].quantity : 0;

        // Check if item has a "Buy X get Y" deal
        if ($quantityInputs.length > 1) {
          // Multiple inputs

          // Get all the quantities of same variants in the cart (including BOGO) in HTML
          $.each($quantityInputs, function (i, input) {
            initialQuantityTotal += parseInt($(input).val());
          });

          // Get quantities from cart object returned from API
          cartItemsArray.forEach(function (item) {
            if (item.variant_id === cartItem.variantID) {
              apiQuantityTotal += item.quantity;
            }
          })
        } else {
          // Single input
          initialQuantityTotal = parseInt($quantityInputs.val());
          apiQuantityTotal = typeof data.items[lineIDIndex] !== 'undefined' ? data.items[lineIDIndex].quantity : 0;
        }

        //Checks to see if there is enough inventory to update to an increased amount
        if (initialQuantityTotal > 0 && initialQuantityTotal > apiQuantityTotal) {
          if (apiQuantityTotal == 1) {
            items_left_text = Shopify.translation.one_item_left;
          } else {
            items_left_text = Shopify.translation.items_left_text;
          }

          $('.warning--quantity').remove();

          //Check if Buy one get one product
          if (totalCartItems < cartItemsArray.length) {

            if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
              // Refreshes cart if inventory is available
              cartItem.parentCartForm.submit();
            } else {
              refreshCart(data);
            }
          } else {
            var warning = '<p class="warning warning--quantity animated bounceIn">' + apiQuantityTotal + ' ' + items_left_text + '</p>';
            cartItem.parentCartForm.find("[data-line-id='" + cartItem.lineID + "'] input").parent().after(warning);
            cartItem.parentCartForm.find("[data-line-id='" + cartItem.lineID + "'] input").val(apiLineItemQuantity);
          }

        } else if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
          // Refreshes cart if inventory is available
          cartItem.parentCartForm.submit();
        } else {
          refreshCart(data);
        }
      }
    });
  }

  function refreshCartID() {
    var cartItem = document.querySelectorAll('.cart__item');

    for(var i = 0; i < cartItem.length; i++) {
      var lineIndex = i + 1;
      var dataLineId = cartItem[i].querySelectorAll('[data-line-id]');

      for(var c = 0; c < dataLineId.length; c++) {
        dataLineId[c].dataset.lineId = lineIndex;
      }
    }
  }

  function refreshCart(cart) {
    $(".cart_count").empty();
    $cartBtn = $(".cart_count");
    var value = $cartBtn.text() || '0';
    var cart_items_html = "";
    var cart_discounts_html = "";
    var cart_action_html = "";
    var cart_savings_html = "";
    var $cart_form = $('[data-cart-form]');
    var productHasSale = false;
    var productCompareAtPrice = 0;
    var productFinalPrice = 0;
    

    $cart_form.data('total-discount', cart.total_discount);

    $cartBtn.text(value.replace(/[0-9]+/,cart.item_count));

    if (cart.item_count == 0) {
      $('.js-empty-cart__message').removeClass('hidden');
      $cart_form.addClass('hidden');
    } else {
      $('.js-empty-cart__message').addClass('hidden');
      $cart_form.removeClass('hidden');

      var total_saving = 0; // adding counter variables for total cart savings
      var saving = 0;

      $.each(cart.items, function(index, item) {
        var itemDiscounts = item.discounts;
        var discountMessage = "";

        for (i=0; i < itemDiscounts.length; i++) {
       
          var title = itemDiscounts[i].title;
          discountMessage = '<p class="notification-discount meta">' + title + '</p>';
        }
        var line_id = index + 1;

        cart_items_html += '<li class="mini-cart__item clearfix" data-cart-item data-line-id="' + line_id + '" data-variant-id="' + item.id + '">' +
          '<a href="' + item.url +'">';
        if (item.image) {
          cart_items_html += '<div class="cart_image">' +
              '<img src="' + item.image.replace(/(\.[^.]*)$/, "_compact$1").replace('http:', '') + '" alt="' + htmlEncode(item.title) + '" />' +
            '</div></a>';
        }

        cart_items_html += '<div class="mini-cart__item--content"><div class="mini-cart__item__title"><div class="item_title"><a href="' + item.url + '">' + item.title + '</a></div>';

        if(item.properties) {
          $.each(item.properties, function(title, value) {
            if (value) {
              cart_items_html += '<div class="line-item">' + title +': ' + value + ' </div>';
            }
          });
        }

        cart_items_html += '<strong class="right price">';

        $.ajax({
          dataType: "json",
          async: false,
          cache: false,
          url: "/products/" + item.handle + ".js",
          success: function(data) {
            // If item has more than one variant, need to make sure we are pulling data from the correct variant
            if (data.variants) {
              var itemVariants = data.variants;
              if (itemVariants.length > 1) {
                for (v = 0; v < itemVariants.length; v++) {
                  if (itemVariants[v].id == item.id) {
                     data = itemVariants[v];
                  }
                }
              }
            }

            // If compare at price exists then item is on sale
            if (data.compare_at_price) {
              if(data.compare_at_price > data.price) {
                productHasSale = true;
                productCompareAtPrice = data.compare_at_price;
                productFinalPrice = data.price;
              }
            } else {
              // Check required for non-sale items
              productHasSale = false;
            }
          }
        });

        if(productHasSale == true) {
           
          //puts the slash through the old item price
          var itemPrice = Shopify.formatMoney(productFinalPrice, $('body').data('money-format')) + ' </span><span class="money was_price">' + Shopify.formatMoney(productCompareAtPrice, $('body').data('money-format')) + '</span>';
          cart_items_html += '<span class="money sale">' + itemPrice + '</strong>';

          // Total savings
          saving = (productCompareAtPrice - productFinalPrice) * item.quantity;
          total_saving = saving + total_saving;
        } else {
           var itemPrice;
          
          if (item.price > item.final_price) {
            //puts the slash through the old item price
             itemPrice = Shopify.formatMoney(item.final_price, $('body').data('money-format')) + ' </span><span class="money was_price">' + Shopify.formatMoney(item.price, $('body').data('money-format')) + '</span>';
            cart_items_html += '<span class="money sale">' + itemPrice + '</strong>';
          } else {
             itemPrice = Shopify.formatMoney(item.price, $('body').data('money-format'));
            cart_items_html += '<span class="money">' + itemPrice + '</span></strong>';
          }
        }

        if (item.price > item.final_price) {
          cart_items_html += discountMessage;
        }

        cart_items_html += '<div class="left product-quantity-box">';
        cart_items_html += '<span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>';
        cart_items_html += '<input type="number" min="0" class="quantity" name="updates[]" id="updates_' + item.id + '" value="' + item.quantity + '" data-cart-quantity-input="mini-cart" />';
        cart_items_html += '<span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>';
        cart_items_html += '</div></div></div>';
        cart_items_html += '<a href="/cart/change?line=' + line_id + '&amp;quantity=0" class="js-cart-remove-btn cart__remove-btn" data-line-id="' + line_id + '" data-remove-item="mini-cart"><span class="remove-icon"></span></a>';

      });

      var cartDiscounts = cart.cart_level_discount_applications;
 

      for (i=0; i < cartDiscounts.length; i++) {
        var amount = Shopify.formatMoney(cartDiscounts[i].total_allocated_amount, $('body').data('money-format'));
        var title = cartDiscounts[i].title;

        cart_discounts_html += '<span class="cart_discounts--title">' + title + '</span>';
        cart_discounts_html += '<span class="cart_discounts--price">';
        cart_discounts_html += '-<span class="money">' + amount + '</span></span>';
      }

      cart_action_html += '<span class="right"><span class="money">' + Shopify.formatMoney(cart.total_price, $('body').data('money-format')) + '</span></span>' + '<span>' + Shopify.translation.cart_subtotal_text + '</span>';
      total_saving = total_saving + cart.total_discount;
      if(Shopify.theme_settings.display_savings && total_saving > 0) {
        cart_savings_html = '<span class="right"><span class="money">' + Shopify.formatMoney(total_saving, $('body').data('money-format')) + '</span></span>' +
            '<span>' + Shopify.translation.cart_savings_text + '</span>';
      } else {
        cart_savings_html = "";
      }
    }

    $('.js-cart_items').html(cart_items_html);
    $('.js-cart_discounts').html(cart_discounts_html);
    $('.js-cart_subtotal').html(cart_action_html);
    $('.js-cart_savings').html(cart_savings_html);

    // Converting the currencies
    if (Currency.show_multiple_currencies) {
      currencyConverter.convertCurrencies();
    }

  }

  $('body').on('change', '[data-cart-quantity-input]', function() {
    var cartItem = {
      lineID: $(this).parents('[data-cart-item]').data('line-id'),
      variantID: $(this).parents('[data-cart-item]').data('variant-id'),
      quantity: $(this).val(),
      parentCartForm: $(this).parents('[data-cart-form]'),
      totalDiscount: $(this).parents('[data-cart-form]').data('total-discount'),
      $element : $(this).parents('[data-cart-item]')
    }
    // Disable button after click to prevent multiple clicks
    $(this).parents('.product-quantity-box').find('.js-change-quantity').addClass('is-disabled');
    updateCartItemQuantity(cartItem);
  });

  $('body').on('click', '[data-remove-item]', function(e) {
    e.preventDefault();
    var cartItem = {
      lineID: $(this).parents('[data-cart-item]').data('line-id'),
      variantID: $(this).parents('[data-cart-item]').data('variant-id'),
      quantity: 0,
      parentCartForm: $(this).parents('[data-cart-form]'),
      totalDiscount: $(this).parents('[data-cart-form]').data('total-discount'),
      $element : $(this).parents('[data-cart-item]')
    }
    cartItem.$element.addClass('animated fadeOutLeft');

    updateCartItemQuantity(cartItem);

    if (cartItem.parentCartForm.data('cart-form') === 'cart-template') {
      cartItem.$element.find('input').val('0');
      cartItem.parentCartForm.submit();
    }

    if (cartItem.parentCartForm.data('cart-form') === 'mini-cart') {
      cartItem.$element.find('input').val('0');
    }
  });

  if (Shopify.theme_settings.cart_action == 'ajax'){
    $(document).on('click', '.ajax-submit', function(e) {
      e.preventDefault();
      var $addToCartForm = $(this).closest('form');
      var $addToCartBtn = $addToCartForm.find('.add_to_cart');

      //Refresh page on quick shop add to cart if on cart page
      if($('body').hasClass('cart')) {
        $addToCartForm.submit();
      }

      $.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: $addToCartForm.serialize(),
        beforeSend: function() {
          $addToCartBtn.attr('disabled', 'disabled').addClass('disabled');
          $addToCartBtn.find('span').removeClass("fadeInDown").addClass('animated zoomOut');
        },
        success: function(itemData) {
          $addToCartBtn.find('.checkmark').addClass('checkmark-active');

          window.setTimeout(function(){
            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
            $addToCartBtn.find('.checkmark').removeClass('checkmark-active');
            $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
          }, 1000);

          $.ajax({
            url: '/cart.js',
            dataType: "json",
            cache: false,
            success: function(cart) {
              setTimeout(function() {
                refreshCart(cart);
                if($('body').hasClass('fancybox-active')) {
                  $.fancybox.close();
                }

                if($('#header').is(':visible')) {
                  $('#header .cart-container').addClass('active_link');
                } else if ($('.sticky_nav--stick').length) {
                  $('.sticky_nav .cart-container').addClass('active_link');
                } else {
                  $('.top-bar .cart-container').addClass('active_link');
                }

                //block scrolling on mobile
                if (Shopify.media_queries.medium.matches) {
                  var $cart_container = $(this).parent();
                  if($cart_container.hasClass('active_link')) {
                    $('body').addClass('blocked-scroll');
                  } else {
                    $('body').addClass('blocked-scroll');
                  }
                }
              }, 500)
            }
          });
        },
        error: function(XMLHttpRequest) {
          var response = eval('(' + XMLHttpRequest.responseText + ')');
          response = response.description;
          $('.warning').remove();

          var warning = '<p class="warning animated bounceIn">' + response.replace('All 1 ', 'All ') + '</p>';
          $addToCartForm.after(warning);
          $addToCartBtn.removeAttr('disabled').removeClass('disabled');
          $addToCartBtn.find('span').text(Shopify.translation.add_to_cart).removeClass('zoomOut').addClass('zoomIn');
        }
      });

      return false;
    });
  }

  productPage.productSwatches();

});

/*============================================================================
  Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
==============================================================================*/
Shopify.updateOptionsInSelector = function(selectorIndex, parent) {
  var key;
  var selector;

  switch (selectorIndex) {
    case 0:
      key = 'root';
      selector = $(parent + ' .single-option-selector:eq(0)');
      break;
    case 1:
       key = $(parent + ' .single-option-selector:eq(0)').val();
       selector = $(parent + ' .single-option-selector:eq(1)');
      break;
    case 2:
      key = $(parent + ' .single-option-selector:eq(0)').val();
      key += ' / ' + $(parent + ' .single-option-selector:eq(1)').val();
      selector = $(parent + ' .single-option-selector:eq(2)');
  }

  var availableOptions = Shopify.optionsMap[key];
  $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
    if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
      $(this).removeClass('soldout').find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
    }
    else {
      $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled','disabled');
    }
  });

};

Shopify.linkOptionSelectors = function(product, parent) {
  var key;
    // Building our mapping object.
    Shopify.optionsMap = {};
    for (var i=0; i<product.variants.length; i++) {
      var variant = product.variants[i];
      if (variant.available) {
        // Gathering values for the 1st drop-down.
        Shopify.optionsMap.root = Shopify.optionsMap.root || [];
        Shopify.optionsMap.root.push(variant.option1);
        Shopify.optionsMap.root = Shopify.uniq(Shopify.optionsMap.root);
        // Gathering values for the 2nd drop-down.
        if (product.options.length > 1) {
          key = variant.option1;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option2);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
        // Gathering values for the 3rd drop-down.
        if (product.options.length === 3) {
          key = variant.option1 + ' / ' + variant.option2;
          Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
          Shopify.optionsMap[key].push(variant.option3);
          Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
        }
      }
    }
    // Update options right away.
    Shopify.updateOptionsInSelector(0, parent);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1, parent);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
    // When there is an update in the first dropdown.
    $(parent + " .single-option-selector:eq(0)").change(function() {
      Shopify.updateOptionsInSelector(1, parent);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
    // When there is an update in the second dropdown.
    $(parent + " .single-option-selector:eq(1)").change(function() {
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, parent);
      return true;
    });
};

//Used for cart functionality
function htmlEncode(value){
    if (value) {
        return $('<div/>').text(value).html();
    } else {
        return '';
    }
}

//Check if device is touch-enabled
function is_touch_device() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}

//Differentiate between mobile and touch screen laptops
var touch_device = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

/* option_selection.js */
function floatToString(t,e){var o=t.toFixed(e).toString();return o.match(/^\.\d+/)?"0"+o:o}if("undefined"==typeof Shopify)var Shopify={};Shopify.each=function(t,e){for(var o=0;o<t.length;o++)e(t[o],o)},Shopify.map=function(t,e){for(var o=[],i=0;i<t.length;i++)o.push(e(t[i],i));return o},Shopify.arrayIncludes=function(t,e){for(var o=0;o<t.length;o++)if(t[o]==e)return!0;return!1},Shopify.uniq=function(t){for(var e=[],o=0;o<t.length;o++)Shopify.arrayIncludes(e,t[o])||e.push(t[o]);return e},Shopify.isDefined=function(t){return"undefined"==typeof t?!1:!0},Shopify.getClass=function(t){return Object.prototype.toString.call(t).slice(8,-1)},Shopify.extend=function(t,e){function o(){}o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t,t.baseConstructor=e,t.superClass=e.prototype},Shopify.locationSearch=function(){return window.location.search},Shopify.locationHash=function(){return window.location.hash},Shopify.replaceState=function(t){window.history.replaceState({},document.title,t)},Shopify.urlParam=function(t){var e=RegExp("[?&]"+t+"=([^&#]*)").exec(Shopify.locationSearch());return e&&decodeURIComponent(e[1].replace(/\+/g," "))},Shopify.newState=function(t,e){var o;return o=Shopify.urlParam(t)?Shopify.locationSearch().replace(RegExp("("+t+"=)[^&#]+"),"$1"+e):""===Shopify.locationSearch()?"?"+t+"="+e:Shopify.locationSearch()+"&"+t+"="+e,o+Shopify.locationHash()},Shopify.setParam=function(t,e){Shopify.replaceState(Shopify.newState(t,e))},Shopify.Product=function(t){Shopify.isDefined(t)&&this.update(t)},Shopify.Product.prototype.update=function(t){for(property in t)this[property]=t[property]},Shopify.Product.prototype.optionNames=function(){return"Array"==Shopify.getClass(this.options)?this.options:[]},Shopify.Product.prototype.optionValues=function(t){if(!Shopify.isDefined(this.variants))return null;var e=Shopify.map(this.variants,function(e){var o="option"+(t+1);return void 0==e[o]?null:e[o]});return null==e[0]?null:Shopify.uniq(e)},Shopify.Product.prototype.getVariant=function(t){var e=null;return t.length!=this.options.length?e:(Shopify.each(this.variants,function(o){for(var i=!0,r=0;r<t.length;r++){var n="option"+(r+1);o[n]!=t[r]&&(i=!1)}return 1==i?void(e=o):void 0}),e)},Shopify.Product.prototype.getVariantById=function(t){for(var e=0;e<this.variants.length;e++){var o=this.variants[e];if(t==o.id)return o}return null},Shopify.money_format="$",Shopify.formatMoney=function(t,e){function o(t,e){return"undefined"==typeof t?e:t}function i(t,e,i,r){if(e=o(e,2),i=o(i,","),r=o(r,"."),isNaN(t)||null==t)return 0;t=(t/100).toFixed(e);var n=t.split("."),a=n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+i),s=n[1]?r+n[1]:"";return a+s}"string"==typeof t&&(t=t.replace(".",""));var r="",n=/\{\{\s*(\w+)\s*\}\}/,a=e||this.money_format;switch(a.match(n)[1]){case"amount":r=i(t,2);break;case"amount_no_decimals":r=i(t,0);break;case"amount_with_comma_separator":r=i(t,2,".",",");break;case"amount_with_apostrophe_separator":r=i(t,2,"'",".");break;case"amount_no_decimals_with_comma_separator":r=i(t,0,".",",")}return a.replace(n,r)},Shopify.OptionSelectors=function(t,e){return this.selectorDivClass="selector-wrapper",this.selectorClass="single-option-selector",this.variantIdFieldIdSuffix="-variant-id",this.variantIdField=null,this.historyState=null,this.selectors=[],this.domIdPrefix=t,this.product=new Shopify.Product(e.product),this.onVariantSelected=Shopify.isDefined(e.onVariantSelected)?e.onVariantSelected:function(){},this.replaceSelector(t),this.initDropdown(),e.enableHistoryState&&(this.historyState=new Shopify.OptionSelectors.HistoryState(this)),!0},Shopify.OptionSelectors.prototype.initDropdown=function(){var t={initialLoad:!0},e=this.selectVariantFromDropdown(t);if(!e){var o=this;setTimeout(function(){o.selectVariantFromParams(t)||o.fireOnChangeForFirstDropdown.call(o,t)})}},Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown=function(t){this.selectors[0].element.onchange(t)},Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown=function(t){var e=this.selectVariantFromParams(t);e||this.selectVariantFromDropdown(t)},Shopify.OptionSelectors.prototype.replaceSelector=function(t){var e=document.getElementById(t),o=e.parentNode;Shopify.each(this.buildSelectors(),function(t){o.insertBefore(t,e)}),e.style.display="none",this.variantIdField=e},Shopify.OptionSelectors.prototype.selectVariantFromDropdown=function(t){var e=document.getElementById(this.domIdPrefix).querySelector("[selected]");if(e||(e=document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')),!e)return!1;var o=e.value;return this.selectVariant(o,t)},Shopify.OptionSelectors.prototype.selectVariantFromParams=function(t){var e=Shopify.urlParam("variant");return this.selectVariant(e,t)},Shopify.OptionSelectors.prototype.selectVariant=function(t,e){var o=this.product.getVariantById(t);if(null==o)return!1;for(var i=0;i<this.selectors.length;i++){var r=this.selectors[i].element,n=r.getAttribute("data-option"),a=o[n];null!=a&&this.optionExistInSelect(r,a)&&(r.value=a)}return"undefined"!=typeof jQuery?jQuery(this.selectors[0].element).trigger("change",e):this.selectors[0].element.onchange(e),!0},Shopify.OptionSelectors.prototype.optionExistInSelect=function(t,e){for(var o=0;o<t.options.length;o++)if(t.options[o].value==e)return!0},Shopify.OptionSelectors.prototype.insertSelectors=function(t,e){Shopify.isDefined(e)&&this.setMessageElement(e),this.domIdPrefix="product-"+this.product.id+"-variant-selector";var o=document.getElementById(t);Shopify.each(this.buildSelectors(),function(t){o.appendChild(t)})},Shopify.OptionSelectors.prototype.buildSelectors=function(){for(var t=0;t<this.product.optionNames().length;t++){var e=new Shopify.SingleOptionSelector(this,t,this.product.optionNames()[t],this.product.optionValues(t));e.element.disabled=!1,this.selectors.push(e)}var o=this.selectorDivClass,i=this.product.optionNames(),r=Shopify.map(this.selectors,function(t){var e=document.createElement("div");if(e.setAttribute("class",o),i.length>1){var r=document.createElement("label");r.htmlFor=t.element.id,r.innerHTML=t.name,e.appendChild(r)}return e.appendChild(t.element),e});return r},Shopify.OptionSelectors.prototype.selectedValues=function(){for(var t=[],e=0;e<this.selectors.length;e++){var o=this.selectors[e].element.value;t.push(o)}return t},Shopify.OptionSelectors.prototype.updateSelectors=function(t,e){var o=this.selectedValues(),i=this.product.getVariant(o);i?(this.variantIdField.disabled=!1,this.variantIdField.value=i.id):this.variantIdField.disabled=!0,this.onVariantSelected(i,this,e),null!=this.historyState&&this.historyState.onVariantChange(i,this,e)},Shopify.OptionSelectorsFromDOM=function(t,e){var o=e.optionNames||[],i=e.priceFieldExists||!0,r=e.delimiter||"/",n=this.createProductFromSelector(t,o,i,r);e.product=n,Shopify.OptionSelectorsFromDOM.baseConstructor.call(this,t,e)},Shopify.extend(Shopify.OptionSelectorsFromDOM,Shopify.OptionSelectors),Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector=function(t,e,o,i){if(!Shopify.isDefined(o))var o=!0;if(!Shopify.isDefined(i))var i="/";var r=document.getElementById(t),n=r.childNodes,a=(r.parentNode,e.length),s=[];Shopify.each(n,function(t,r){if(1==t.nodeType&&"option"==t.tagName.toLowerCase()){var n=t.innerHTML.split(new RegExp("\\s*\\"+i+"\\s*"));0==e.length&&(a=n.length-(o?1:0));var p=n.slice(0,a),l=o?n[a]:"",c=(t.getAttribute("value"),{available:t.disabled?!1:!0,id:parseFloat(t.value),price:l,option1:p[0],option2:p[1],option3:p[2]});s.push(c)}});var p={variants:s};if(0==e.length){p.options=[];for(var l=0;a>l;l++)p.options[l]="option "+(l+1)}else p.options=e;return p},Shopify.SingleOptionSelector=function(t,e,o,i){this.multiSelector=t,this.values=i,this.index=e,this.name=o,this.element=document.createElement("select");for(var r=0;r<i.length;r++){var n=document.createElement("option");n.value=i[r],n.innerHTML=i[r],this.element.appendChild(n)}return this.element.setAttribute("class",this.multiSelector.selectorClass),this.element.setAttribute("data-option","option"+(e+1)),this.element.id=t.domIdPrefix+"-option-"+e,this.element.onchange=function(o,i){i=i||{},t.updateSelectors(e,i)},!0},Shopify.Image={preload:function(t,e){for(var o=0;o<t.length;o++){var i=t[o];this.loadImage(this.getSizedImageUrl(i,e))}},loadImage:function(t){(new Image).src=t},switchImage:function(t,e,o){if(t&&e){var i=this.imageSize(e.src),r=this.getSizedImageUrl(t.src,i);o?o(r,t,e):e.src=r}},imageSize:function(t){var e=t.match(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./);return null!=e?e[1]:null},getSizedImageUrl:function(t,e){if(null==e)return t;if("master"==e)return this.removeProtocol(t);var o=t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);if(null!=o){var i=t.split(o[0]),r=o[0];return this.removeProtocol(i[0]+"_"+e+r)}return null},removeProtocol:function(t){return t.replace(/http(s)?:/,"")}},Shopify.OptionSelectors.HistoryState=function(t){this.browserSupports()&&this.register(t)},Shopify.OptionSelectors.HistoryState.prototype.register=function(t){window.addEventListener("popstate",function(e){t.selectVariantFromParamsOrDropdown({popStateCall:!0})})},Shopify.OptionSelectors.HistoryState.prototype.onVariantChange=function(t,e,o){this.browserSupports()&&(!t||o.initialLoad||o.popStateCall||Shopify.setParam("variant",t.id))},Shopify.OptionSelectors.HistoryState.prototype.browserSupports=function(){return window.history&&window.history.replaceState};

$(document)
  .on('shopify:block:select', function(e){

    var blockId = e.detail.blockId;
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('shopify-section--slideshow') || $parentSection.hasClass('shopify-section--testimonials')) {
      sliderBlock.select(blockId, $parentSection);
    }

    if ($parentSection.find('.block__recommended_products')) {
      productPage.unload($parentSection);
      productPage.init();
    }

    if($parentSection.hasClass('shopify-section--product-details-template')) {
      if($('.shopify-section--map').length) {
        mapFunction.init();
      }

      if($('.shopify-section--featured-collection').length) {
        featuredCollectionSection.init();
        videoFeature.init();
      }

      if ($('shopify-section--video').length) {
        videoSection.init();
      }

      if($('.recently-viewed__section').length && Shopify.theme_settings.collection_secondary_image) {
        imageFunctions.showSecondaryImage();
      }
    }

    if($parentSection.hasClass('shopify-section--page-details-template')) {
      if($('.shopify-section--map').length) {
        mapFunction.init();
      }

      if($('.shopify-section--featured-collection').length) {
        featuredCollectionSection.init();
        videoFeature.init();
      }

      if ($('shopify-section--video').length) {
        videoSection.init();
      }

      if($('.recently-viewed__section').length && Shopify.theme_settings.collection_secondary_image) {
        imageFunctions.showSecondaryImage();
      }
    }

    if ($parentSection.hasClass('shopify-section--cart-template')) {
      if ($('.block__featured_collection').length){
        featuredCollectionSection.init();
      }
    }

    if ($parentSection.hasClass('shopify-section--product-template')) {
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('#shopify-product-reviews').length >= 1) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }
    }

});

$(document)
  .on('shopify:block:deselect', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('shopify-section--slideshow') || $parentSection.hasClass('shopify-section--testimonials')) {
      sliderBlock.deselect($parentSection);
    }
});

$(document)
  .on('shopify:section:reorder', function(e){

    utils.pageBannerCheck();

});

$(document)
  .on('shopify:section:load', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    utils.pageBannerCheck();
    utils.enableDisclosure();

    if (Shopify.theme_settings.enable_autocomplete) {
      searchAutocomplete.init();
    }

    if (Shopify.theme_settings.newsletter_popup) {
      newsletter_popup.init();
    }

    if ($parentSection.hasClass('shopify-section--page-gallery-template')) {
      gallery.init($parentSection);
    }

    if ($parentSection.hasClass('shopify-section--gallery')) {
      gallery.init();
    }

    if ($parentSection.hasClass('shopify-section--page-faq-template') || $parentSection.hasClass('shopify-section--faq')) {
      globalAccordions.init();
    }

    if ($parentSection.hasClass('shopify-section--cart-template')) {
      cart.init();

      if ($('.block__featured_collection').length) {
        featuredCollectionSection.init();
      }
    }

    if ($parentSection.hasClass('shopify-section--featured-promotions')) {
      featuredPromotions.init();
    }

    if ($parentSection.hasClass('shopify-section--slideshow')) {
      slideshow.init();
    }

    if ($parentSection.hasClass('shopify-section--testimonials')) {
      testimonial.init();
    }

    if ($parentSection.hasClass('shopify-section--featured-products')) {
      productPage.init();
      videoFeature.init();
      productPage.productSwatches();
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('.shopify-product-reviews-badge').length) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }
    }

    if($parentSection.hasClass('shopify-section--map')) {
      mapFunction.init();
    }

    if ($parentSection.hasClass('shopify-section--featured-collection')) {
      featuredCollectionSection.init();
      videoFeature.init();
    }

    if ($parentSection.hasClass('shopify-section--video')) {
      videoSection.init();
    }

    if ($parentSection.hasClass('shopify-section--product-template')) {
      productPage.init();
      videoFeature.init();
      productPage.productSwatches();
      recentlyViewed.init();
      if (Shopify.theme_settings.enable_shopify_review_comments){
        if($('#shopify-product-reviews').length || $('.shopify-product-reviews-badge').length) {
          SPR.$(document).ready(function() {
            return SPR.registerCallbacks(),
            SPR.initRatingHandler(),
            SPR.initDomEls(),
            SPR.loadProducts(),
            SPR.loadBadges()
          })
        }
      }

      // Product review scroll
      utils.productReviewScroll();
    }

    if ($parentSection.hasClass('recommended-products-section')) {
      productPage.init();
    }

    if ($parentSection.hasClass('shopify-section--recently-viewed-products')) {
      recentlyViewed.init();
    }

    if ($parentSection.hasClass('shopify-section--article-template')) {
      if(window.location.pathname.indexOf('/comments') != -1) {
        $('html,body').animate({scrollTop: $("#new-comment").offset().top-140},'slow');
      }
    }

    if ($parentSection.hasClass('shopify-section--collection-template')) {
      collectionSidebarFilter.init();
      recentlyViewed.init();
    }

    if($parentSection.hasClass('shopify-section--contact-section')) {
      mapFunction.init();
    }

    if ($parentSection.hasClass('shopify-section--search-template')) {
      if (Shopify.theme_settings.enable_autocomplete){
        searchAutocomplete.init();
      }
      collectionSidebarFilter.init();
    }

    if ($parentSection.hasClass('shopify-section--header')) {
      header.init();
      header.loadMegaMenu();
    }

    if ($parentSection.hasClass('shopify-section--mega-menu')) {
      header.loadMegaMenu();
    }

    if ($parentSection.hasClass('shopify-section--page-details-template')) {
      featuredCollectionSection.init();
      videoSection.init();
      recentlyViewed.init();

      if($('.block__image_gallery').length) {
        gallery.init();
      };
    }

    if ($parentSection.hasClass('shopify-section--product-details-template')) {
      featuredCollectionSection.init();
      videoSection.init();
      mapFunction.init();
      if($('.block__image_gallery').length) {
        gallery.init();
      };
      recentlyViewed.init();
      productPage.init();
    }
});


$(document)
  .on('shopify:section:unload', function(e){
    var $target = $(e.target);
    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('shopify-section--header')) {
      header.unload($target);
      header.unloadMegaMenu();
    }

    if ($parentSection.hasClass('shopify-section--slideshow')) {
      slideshow.unload($target);
    }

    if ($parentSection.hasClass('shopify-section--testimonials')) {
      testimonial.unload($target);
    }

    if ($parentSection.hasClass('shopify-section--search')) {
      searchAutocomplete.unload($target);
    }

    if ($parentSection.hasClass('shopify-section--product-template')) {
      productPage.unload($parentSection);
    }

    if ($parentSection.hasClass('shopify-section--featured-products')) {
      productPage.unload($parentSection);
    }

    if ($parentSection.hasClass('shopify-section--mega-menu')) {
      header.unloadMegaMenu();
    }

});

$(document)
  .on('shopify:section:select', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('shopify-section--mega-menu')) {
      var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
      setTimeout(function() {
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseenter');
        $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').addClass('editor-hover--true');
        header.removeDataAttributes('.header .mega-menu.dropdown_container .dropdown_column');
      }, 10);
    }

    if ($parentSection.hasClass('shopify-section--featured-collection')) {
      featuredCollectionSection.unload($parentSection);
      featuredCollectionSection.init();
    }

    utils.pageBannerCheck();
    var evt = document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
});

$(document)
  .on('shopify:section:deselect', function(e){

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    if ($parentSection.hasClass('shopify-section--mega-menu')) {
      var megaMenuParent = $('.header .' + e.detail.sectionId).data('dropdown');
      $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').trigger('mouseout');
      $('a.mega-menu-parent[data-dropdown-rel="' + megaMenuParent + '"]').parents('header').removeClass('editor-hover--true');
    }
});

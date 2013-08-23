      $(document).ready(function () {
          function PaymillResponseHandler(error, result) {
              if (error) {
                  // Show the error message above the form
                  $(".payment-errors").text(error.apierror);
              } else {
                  $(".payment-errors").text("");
                  var form = $("#payment-form");
                  // Token
                  var token = result.token;
                  // Insert token into the payment form
                  form.append("<input type='hidden' name='paymillToken' value='" + token + "'/>");
                  form.get(0).submit();
              }
              $(".submit-button").removeAttr("disabled");
          }

          $("#payment-form").submit(function (event) {
              // Deactivate the submit button to avoid further clicks
              $('.submit-button').attr("disabled", "disabled");
              if (false == paymill.validateCardNumber($('.card-number').val())) {
                  $(".payment-errors").text("Invalid card number");
                  $(".submit-button").removeAttr("disabled");
                  return false;
              }

              if (false == paymill.validateExpiry($('.card-expiry-month').val(), $('.card-expiry-year').val())) {
                  $(".payment-errors").text("Invalid date of expiry");
                  $(".submit-button").removeAttr("disabled");
                  return false;
              }

              // to test in real
              // if (false == paymill.validateExpiry($('.card-holdername').val())) {
              //     $(".payment-errors").text("Invalid card holdername");
              //     $(".submit-button").removeAttr("disabled");
              //     return false;
              // }

              paymenttype = $('.paymenttype.disabled').length ? $('.paymenttype.disabled').val() : 'cc';
              switch (paymenttype) {
                  case "cc":
                      var params = {
                          amount_int:     $('.card-amount-int').val(),  // E.g. "15" for 0.15 Eur
                          //amount:         $('.card-amount').val(),    // deprecated!
                          currency:       $('.card-currency').val(),    // ISO 4217 e.g. "EUR"
                          number:         $('.card-number').val(),
                          exp_month:      $('.card-expiry-month').val(),
                          exp_year:       $('.card-expiry-year').val(),
                          cvc:            $('.card-cvc').val(),
                          cardholdername: $('.card-holdername').val()  // optional
                      };
                      break;

                  case "elv":
                      var params = {
                          number:         $('.elv-account').val(),
                          bank:           $('.elv-bankcode').val(),
                          accountholder:  $('.elv-holdername').val()
                      };
                      break;
              }
              /*
              3-D secured customization
              https://www.paymill.com/en-gb/documentation-3/reference/paymill-bridge/
              http://stackoverflow.com/questions/15031505/paymill-3d-secure-bug-with-at-least-one-bank
              */
              paymill.createToken(params, PaymillResponseHandler);

              /*
              var tdsInit = function tdsInit(redirect, cancelCallback) {
                  var url = redirect.url, params = redirect.params;
                  var body = document.body || document.getElementsByTagName('body')[0];

                  var iframe = document.createElement('iframe');
                  body.insertBefore(iframe, body.firstChild);

                  var iframeDoc = iframe.contentWindow || iframe.contentDocument;
                  if (iframeDoc.document) iframeDoc = iframeDoc.document;

                  var form = iframeDoc.createElement('form');
                  form.method = 'post';
                  form.action = url;

                  for (var k in params) {
                      var input = iframeDoc.createElement('input');
                      input.type = 'hidden';
                      input.name = k;
                      input.value = decodeURIComponent(params[k]);
                      form.appendChild(input);
                  }

                  if (iframeDoc.body) iframeDoc.body.appendChild(form);
                  else iframeDoc.appendChild(form);

                  form.submit();
              };

              var tdsCleanup = function tdsCleanup(redirect, cancelCallback) {
                // ??
              };

              paymill.createToken(params, PaymillResponseHandler, tdsInit, tdsCleanup);
              */

              // change the "cancel" button label of the 3-D iframe
              paymill.config('3ds_cancel_label', 'atzera');

              return false;
          });

          // Toggle buttons and forms
          $(".paymenttype").click(function (event) {
              $(this).addClass('btn-primary disabled');
              $('#payment-form-cc').toggle();
              $('#payment-form-elv').toggle();
              if($(this).val()=='cc') {
                  $('#btn-paymenttype-elv').removeClass('btn-primary disabled');
              }
              else {
                  $('#btn-paymenttype-cc').removeClass('btn-primary disabled');
              }
          });
      });

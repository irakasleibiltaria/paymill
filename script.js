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
                          cardholdername: $('.card-holdername').val()
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
              paymill.createToken(params, PaymillResponseHandler);

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

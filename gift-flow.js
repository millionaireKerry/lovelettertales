(function () {
  'use strict';
  async function api(data) {
    var response = await fetch('/api/gifts', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    var result;
    try { result = await response.json(); } catch (_) { throw new Error('We could not connect just now. Please try again or contact us.'); }
    if (!response.ok) throw new Error(result.error || 'We could not complete this. Please contact us.');
    return result;
  }
  var query = new URLSearchParams(location.search);
  var fragment = new URLSearchParams(location.hash.slice(1));
  var code = (fragment.get('code') || query.get('code') || '').trim().toUpperCase();
  var modern = /^LLT-(?:[A-F0-9]{8}-){3}[A-F0-9]{8}$/.test(code);
  var session = query.get('session_id');
  // These pages have no analytics. Strip query capabilities from the address bar.
  if (session || query.has('code')) history.replaceState(null,'',location.pathname + (code ? '#code=' + encodeURIComponent(code) : ''));

  var orderStatus = document.getElementById('order-status');
  if (orderStatus && session) {
    var check = document.getElementById('check-order');
    async function loadOrder() {
      check.hidden = true;
      orderStatus.textContent = 'Checking your payment and preparing your gift…';
      try {
        var order = await api({action:'order',session:session});
        var container = document.getElementById('order-cards');
        container.replaceChildren();
        if (!order.gifts.length) {
          orderStatus.textContent = 'Your payment is confirmed. Please send us your chosen story and delivery address using the contact page so we can prepare your letters.';
          return;
        }
        orderStatus.textContent = order.emailState === 'accepted' ? 'Your gift is ready. We’ve submitted your gift email for delivery. You can also open your card below.' : 'Your gift is ready below. Your email is still awaiting delivery; you can use your card now and contact us if it does not arrive.';
        document.getElementById('legacy-personalisation').hidden = true;
        order.gifts.forEach(function (gift, i) {
          var p = document.createElement('p');
          var a = document.createElement('a');
          a.className = 'btn btn-primary';
          a.href = '/gift-card.html#code=' + encodeURIComponent(gift.code);
          a.textContent = 'Open your ' + gift.months + '-month gift' + (order.gifts.length > 1 ? ' (' + (i + 1) + ')' : ' card');
          p.appendChild(a); container.appendChild(p);
        });
      } catch (error) { orderStatus.textContent = error.message; check.hidden = false; }
    }
    check.addEventListener('click',loadOrder);
    loadOrder();
  }

  var cardStatus = document.getElementById('card-status');
  if (cardStatus && modern) {
    var card = document.querySelector('.card');
    var print = document.querySelector('.btn-print');
    card.hidden = true; print.disabled = true;
    cardStatus.textContent = 'Checking your gift…';
    api({action:'card',code:code}).then(function (gift) {
      document.getElementById('field-code').value = gift.code;
      document.getElementById('field-code').readOnly = true;
      document.getElementById('card-subtitle').textContent = gift.months + ' months · ' + (gift.months * 2) + ' letters · ' + gift.zone + ' delivery';
      document.getElementById('redeem-link').href = '/redeem.html#code=' + encodeURIComponent(gift.code);
      cardStatus.textContent = gift.redeemed ? 'This gift has already been redeemed. Contact us if you need help with the delivery details.' : 'Add a name and message, then print or save as PDF. Your changes stay on this device; send the saved PDF to share your personalised card.';
      card.hidden = false; print.disabled = false;
    }).catch(function (error) { cardStatus.textContent = error.message; });
  } else if (cardStatus && !code) {
    cardStatus.textContent = 'Gift card preview. To use a purchased gift, open the private link in your gift email.';
  }

  var form = document.getElementById('redeem-gift');
  if (form) {
    if (modern) document.getElementById('new-gift-code').value = code;
    else if (code) {
      document.getElementById('older-gift').open = true;
      document.getElementById('gift-code').value = code.slice(0,20);
    }
    form.addEventListener('submit',async function (event) {
      event.preventDefault();
      var button=form.querySelector('[type="submit"]');
      if (!form.reportValidity() || button.disabled) return;
      button.disabled=true;
      var status=document.getElementById('redemption-status');
      status.textContent='Checking your gift and saving your delivery details…';
      try {
        var data=Object.fromEntries(new FormData(form)); data.action='redeem';
        await api(data);
        status.textContent='Your gift is redeemed and your delivery details are saved. We’ll prepare your letters and email you when they are ready to post. Contact us if you need to change your address.';
        button.textContent='Gift redeemed';
      } catch (error) { status.textContent=error.message; button.disabled=false; }
    });
  }
})();

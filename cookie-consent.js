// Love Letter Tales — Cookie Consent
(function () {
  // Don't show if already accepted or declined
  if (localStorage.getItem('llt_cookie_consent')) return;

  // Inject styles
  var style = document.createElement('style');
  style.textContent = `
    #llt-cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #2d1f1f;
      color: #f5f0e8;
      padding: 18px 24px;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      font-family: 'Lato', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 0 -2px 12px rgba(0,0,0,0.3);
    }
    #llt-cookie-banner p {
      margin: 0;
      flex: 1;
      min-width: 200px;
    }
    #llt-cookie-banner a {
      color: #c9a96e;
      text-decoration: underline;
    }
    #llt-cookie-banner .llt-cookie-buttons {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    #llt-cookie-accept {
      background: #c9a96e;
      color: #2d1f1f;
      border: none;
      padding: 9px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
    }
    #llt-cookie-accept:hover {
      background: #b8934a;
    }
    #llt-cookie-decline {
      background: transparent;
      color: #f5f0e8;
      border: 1px solid #f5f0e8;
      padding: 9px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
    }
    #llt-cookie-decline:hover {
      background: rgba(255,255,255,0.1);
    }
    @media (max-width: 600px) {
      #llt-cookie-banner {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;
  document.head.appendChild(style);

  // Create banner HTML
  var banner = document.createElement('div');
  banner.id = 'llt-cookie-banner';
  banner.innerHTML = `
    <p>
      We use cookies to improve your experience and to help us understand how you use our site.
      By clicking "Accept", you consent to our use of cookies for analytics and personalisation.
      Read our <a href="/privacy.html">Privacy Policy</a> for more information.
    </p>
    <div class="llt-cookie-buttons">
      <button id="llt-cookie-decline">Decline</button>
      <button id="llt-cookie-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Accept handler
  document.getElementById('llt-cookie-accept').addEventListener('click', function () {
    localStorage.setItem('llt_cookie_consent', 'accepted');
    banner.style.display = 'none';
  });

  // Decline handler
  document.getElementById('llt-cookie-decline').addEventListener('click', function () {
    localStorage.setItem('llt_cookie_consent', 'declined');
    banner.style.display = 'none';
  });
})();

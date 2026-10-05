const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = fs.readdirSync(root).filter(x => x.endsWith('.html'));

test('Every public local link, stylesheet and image resolves; fragment targets exist', () => {
  for (const file of pages.filter(x => x !== 'gift-admin.html')) {
    const html = read(file).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    for (const match of html.matchAll(/\b(?:href|src)="([^\"]+)"/g)) {
      const url = match[1];
      if (/^(https?:|mailto:|data:|tel:)/.test(url)) continue;
      const [target, fragment] = url.split('#');
      const name = target.split('?')[0].replace(/^\//, '') || file;
      assert.ok(fs.existsSync(path.join(root, name)), `${file}: missing ${url}`);
      if (fragment && name.endsWith('.html')) assert.ok(read(name).includes(`id="${fragment}"`), `${file}: missing anchor ${url}`);
    }
  }
});

test('HTML pages have unique IDs, balanced main landmarks and valid inline scripts/schema', () => {
  for (const file of pages) {
    const html = read(file);
    const ids = [...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').matchAll(/\bid="([^\"]+)"/g)].map(x => x[1]);
    assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
    assert.equal((html.match(/<main\b/g) || []).length, (html.match(/<\/main>/g) || []).length, `${file}: unbalanced main`);
    for (const [full, attrs, content] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (attrs.includes('application/ld+json')) JSON.parse(content);
      else if (!attrs.includes('src=')) new vm.Script(content, { filename: file });
    }
  }
});

test('All delivery selectors wire every shown price and payment link', () => {
  for (const file of ['index.html', 'pricing.html', 'gift.html', 'mothers-day.html']) {
    const html = read(file);
    if (!html.includes('id="btn-intl"')) continue;
    assert.ok(html.includes('src="pricing.js"'), file);
    const nodes = {};
    for (const [,id] of html.matchAll(/\bid="([^\"]+)"/g)) nodes[id] = { classList: { toggle() {} }, setAttribute() {}, style: {} };
    for (const key of ['monthly', 'annual', 'gift3', 'gift6', 'gift12']) if (nodes['price-' + key]) assert.ok(nodes['link-' + key], `${file}: price needs a matching link`);
    const sandbox = { window: {}, document: { getElementById: id => nodes[id] }, sessionStorage: { getItem: () => null, setItem() {} } };
    vm.runInNewContext(read('pricing.js'), sandbox);
    sandbox.window.setDelivery('intl');
    if (nodes['price-monthly']) assert.equal(nodes['price-monthly'].textContent, '£17.99');
    assert.equal(nodes['price-gift3'].textContent, '£49.99');
    assert.equal(nodes['link-gift3'].href, 'https://buy.stripe.com/fZu00i7bT43kfoE1Sw1Nu07');
    sandbox.window.setDelivery('uk');
    assert.equal(nodes['price-gift3'].textContent, '£34.99');
    assert.equal(nodes['link-gift3'].href, 'https://buy.stripe.com/7sY9AS8fX2Zgdgw9kY1Nu02');
    sandbox.sessionStorage.getItem = () => { throw new Error('Blocked storage'); };
    assert.doesNotThrow(() => vm.runInNewContext(read('pricing.js'), sandbox));
  }
});

test('Forms declare real Netlify endpoints, field names, success destinations and honeypots', () => {
  for (const file of pages.filter(x => x !== 'gift-admin.html')) {
    for (const [form, attrs] of read(file).matchAll(/<form([^>]*)>[\s\S]*?<\/form>/g)) {
      assert.match(attrs, /method="POST"/i, file);
      assert.match(attrs, /data-netlify="true"/, file);
      assert.match(attrs, /action="\/form-received.html"/, file);
      assert.match(attrs, /netlify-honeypot="bot-field"/, file);
      assert.match(form, /name="form-name"/, file);
      assert.doesNotMatch(attrs, /onsubmit=/, file);
    }
  }
  assert.doesNotMatch(read('redeem.html'), /llt_gift_log|Your gift is confirmed/);
  assert.match(read('redeem.html'), /name="address"/);
});

test('No unconditional tracking, unsupported testimonials or missing schema logos', () => {
  for (const file of pages) {
    assert.doesNotMatch(read(file), /<script[^>]+(?:googletagmanager|googlesyndication)/, file);
    assert.doesNotMatch(read(file), /images\/logo\.png/, file);
    assert.doesNotMatch(read(file), /aggregateRating|reviewCount/, file);
  }
  assert.doesNotMatch(read('index.html'), /Sarah T\.|Gemma R\.|Diane W\.|SearchAction/);
  const product = [...read('pricing.html').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x => JSON.parse(x[1])).find(x => x['@type'] === 'Product');
  assert.deepEqual(product.offers.map(x => x.price), ['12.99', '119.99']);
});

test('Production build does not expose the administration helper or development tools', () => {
  require('../tools/build.cjs');
  assert.ok(fs.existsSync(path.join(root, 'dist', 'index.html')));
  for (const file of ['gift-admin.html','AGENTS.md','package.json','tools','tests']) assert.ok(!fs.existsSync(path.join(root, 'dist', file)), file);
});

/* global FB */

import Domodule from 'domodule';
import { findOne, on } from 'domassist';

const BASE_URLS = {
  facebook: 'https://www.facebook.com/sharer/sharer.php',
  linkedin: 'https://www.linkedin.com/shareArticle',
  pinterest: 'https://pinterest.com/pin/create/button',
  reddit: 'https://reddit.com/submit',
  twitter: 'https://twitter.com/intent/tweet',
  bluesky: 'https://bsky.app/intent/compose',
  whatsapp: 'https://api.whatsapp.com/send'
};

export default class SocialShareButton extends Domodule {
  postInit() {
    const setupMethod = `${this.options.net}Setup`;
    const shareMethod = `${this.options.net}Share`;

    if (!this[shareMethod] && !this[setupMethod]) {
      throw new Error(`Sharing method for ${this.options.net} is not implemented`);
    }

    if (this[setupMethod]) {
      this[setupMethod]();
    }

    if (this[shareMethod]) {
      on(this.el, 'click', event => {
        event.preventDefault();
        this[shareMethod]();
      });
    }
  }

  get required() {
    return {
      options: ['net']
    };
  }

  get defaults() {
    return {
      relative: false,
      baseUrl: false
    };
  }

  getShareUrl() {
    let url = window.location.href;

    if (this.options.baseUrl) {
      if (this.options.relative) {
        url = `${window.location.origin}${window.location.pathname}${this.options.baseUrl}`;
      } else {
        url = this.options.baseUrl;
      }
    }

    return url;
  }

  twitterShare() {
    SocialShareButton.openWindow(this.el.href, '260', '500', 'twitterWindow');
  }

  blueSkyShare() {
    SocialShareButton.openWindow(this.el.href, '260', '500', 'blueskyWindow');
  }

  linkedinShare() {
    SocialShareButton.openWindow(this.el.href, '520', '570', 'linkedinWindow');
  }

  pinterestShare() {
    SocialShareButton.openWindow(this.el.href, '600', '600', 'pinterestWindow');
  }

  redditShare() {
    SocialShareButton.openWindow(this.el.href, '600', '600', 'redditWindow');
  }

  whatsappShare() {
    SocialShareButton.openWindow(this.el.href, '550', '400', 'whatsappWindow');
  }

  facebookShare() {
    if (typeof window.FB !== 'undefined' &&
      typeof window.FB.ui !== 'undefined') {
      const object = {
        method: 'share',
        href: this.getShareUrl()
      };

      if (this.options.tag) {
        object.hashtag = `#${this.options.tag}`;
      }

      if (this.options.text) {
        object.quote = this.options.text;
      }

      FB.ui(object);
    } else {
      SocialShareButton.openWindow(this.el.href, '440', '600', 'facebookWindow');
    }
  }

  facebookSetup() {
    const params = [`u=${this.getShareUrl()}`];

    if (this.options.tag) {
      params.push(`hashtag=${encodeURIComponent(`#${this.options.tag}`)}`);
    }

    if (this.options.text) {
      params.push(`quote=${encodeURIComponent(this.options.text)}`);
    }

    this.el.href = `${BASE_URLS.facebook}?${params.join('&')}`;
  }

  emailSetup() {
    const title = encodeURIComponent(this.options.subject || document.title);
    let body = this.options.body || 'Check this out #url';
    body = body.replace(/#url/gi, this.getShareUrl());
    body = encodeURIComponent(body);

    this.el.href = `mailto:?subject=${title}&body=${body}`;
  }

  linkedinSetup() {
    // linkedin only allows the url param for security reasons:
    this.el.href = `${BASE_URLS.linkedin}?mini=true&url=${encodeURIComponent(this.getShareUrl())}`;
  }

  twitterSetup() {
    const shareText = this.options.text || SocialShareButton.getMeta('text', 'twi');
    const shareTag = this.options.tags || SocialShareButton.getMeta('hashtag', 'twi');
    const shareVia = this.options.via || SocialShareButton.getMeta('author', 'twi');
    const shareImage = this.options.image || SocialShareButton.getMeta('image', 'twi');

    const params = [];

    params.push(`url=${encodeURIComponent(this.getShareUrl())}`);

    if (shareText) {
      params.push(`text=${encodeURIComponent(shareText)}`);
    }

    if (shareTag && shareTag !== 'none') {
      params.push(`hashtags=${encodeURIComponent(shareTag)}`);
    }

    if (shareVia && shareVia !== 'none') {
      params.push(`via=${encodeURIComponent(shareVia)}`);
    }

    if (shareImage) {
      params.push(`media=${encodeURIComponent(shareImage)}`);
    }
    this.el.href = `${BASE_URLS.twitter}?${params.join('&')}`;
  }

  blueskySetup() {
    const shareText = this.options.text || SocialShareButton.getMeta('text', 'twi');
    const params = [];
    const fullText = `${shareText}\n${this.getShareUrl()}`;

    if (shareText) {
      params.push(`text=${encodeURIComponent(fullText)}`);
    }

    this.el.href = `${BASE_URLS.bluesky}?${params.join('&')}`;
  }

  pinterestSetup() {
    const shareTitle = this.options.title || SocialShareButton.getMeta('title');
    const shareMedia = this.options.media || SocialShareButton.getMeta('image');

    const params = [
      `url=${encodeURIComponent(this.getShareUrl())}`
    ];

    if (shareTitle) {
      params.push(`description=${encodeURIComponent(shareTitle)}`);
    }

    if (shareMedia) {
      params.push(`media=${encodeURIComponent(shareMedia)}`);
    }

    this.el.href = `${BASE_URLS.pinterest}?${params.join('&')}`;
  }

  redditSetup() {
    const shareTitle = this.options.title;

    const params = [
      `url=${encodeURIComponent(this.getShareUrl())}`
    ];

    if (shareTitle) {
      params.push(`title=${encodeURIComponent(shareTitle)}`);
    }

    this.el.href = `${BASE_URLS.reddit}?${params.join('&')}`;
  }

  whatsappSetup() {
    const shareText = this.options.text || SocialShareButton.getMeta('text');
    const params = [];

    if (shareText) {
      params.push(`text=${encodeURIComponent(shareText)}`);
    }

    this.el.href = `${BASE_URLS.whatsapp}?${params.join('&')}`;
  }

  static getMeta(tag, prop = 'og') {
    const meta = findOne(`meta[property="${prop}:${tag}"]`);
    return meta ? meta.getAttribute('content') : null;
  }

  static openWindow(url, height, width, key) {
    window.open(
      url,
      key,
      `menubar=no,toolbar=no,left=200,top=200,resizable=yes,scrollbars=no,height=${height},width=${width}`);
  }
}

Domodule.register('SocialShareButton', SocialShareButton);

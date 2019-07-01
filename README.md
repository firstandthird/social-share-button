# Social Share Buttons

![npm](https://img.shields.io/npm/v/social-share-button.svg)

Social sharing buttons for [Domodule](https://github.com/firstandthird/domodule).

## Installation

```sh
npm i social-share-button
```

## Usage

```html
<body>
  <a data-module="SocialShareButton"
         data-module-text="No water in mars yet"
         data-module-tags="not,awesome"
         data-module-via="NASA"
         data-module-base-url="https://firstandthird.com/"
         data-module-net="twitter">Share on Twitter custom all</a>
</body>
```

It supports the following sharing methods:

* Email: `email`
* GPlus: `gplus`
* LinkedIn: `linkedin`
* Facebook: `facebook`
* Twitter: `twitter`

They're controlled with the `data-module-net` option.

## ShareUrl

**All** of the networks have a way to set the sharing url which is controlled via the `data-module-base-url` attribute. Should `data-module-relative` appear on the element, the URL would be based on the current one.

### Email Options

| Option     | Default       | Description                                                 |
|------------|---------------|--------------------------------------------------------|
| `subject` | `document.title` | Email's subject. |
| `body`    | `Check this out #url` | Note that `#url` will be replaced with `shareUrl` |

### LinkedIn Options

| Option     | Default       | Description                                                 |
|------------|---------------|--------------------------------------------------------|
| `text` | N/A | Linkedin's post text. |
| `title` | N/A | Linkedin's post title. |

### Twitter Options

| Option     | Default       | Description                                                 |
|------------|---------------|--------------------------------------------------------|
| `text` | `<meta property="twi:text" content="">` content's value | Twitter's post text. |
| `tags` | `<meta property="twi:hashtag" content="">` content's value | Hashtags |
| `via` | `<meta property="twi:author" content="">` content's value | Twitter's author |

### Facebook Options

Have in mind that facebook needs [OG tags](https://developers.facebook.com/docs/sharing/webmasters/) for the post to be formatted correctly.

| Option     | Default       | Description                                                 |
|------------|---------------|--------------------------------------------------------|
| `tag` | N/A | Post's tags. |
| `text` | N/A | Post's text. Note that due to facebook limitation's this is seen as a byline rather than as text. |

// Sets up public path for webpack
// eslint-disable-next-line
__webpack_public_path__ =
    process.env.WEBPACK_PUBLIC_PATH ||
    process.env.IE_CDN_URL ||
    window.location.protocol + '//' + window.location.host + '/'

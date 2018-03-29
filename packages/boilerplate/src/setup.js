const Boilerplate = window.cccisd.boilerplate

// Exposes global Perf if it's not the production mode
if (process.env.NODE_ENV !== 'production') {
    window.Perf = require('react-addons-perf') // eslint-disable-line global-require
}

// Sets up public path for webpack
// eslint-disable-next-line
__webpack_public_path__ =
    process.env.WEBPACK_PUBLIC_PATH || Boilerplate.settings.publicUrl + 'build/js/'

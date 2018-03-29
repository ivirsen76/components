## Changelog

### 5.0.0 - 2018-01-22
- Use https for webpack-dev-server (You need to accept certificate in a browser)

### 3.0.0 - 2017-11-05
- Webpack will extract all css into separate file in production mode
- File "storage/app/css.bundle.filename" will contain stylesheet filename which needs to be included on the page

### 2.0.0 - 2017-10-25
- Every generate bundle file includes unique hash in production mode
- File "storage/app/js.bundle.filename" will contain filename which needs to be included on the page instead of 'app.bundle.js'
- Using webpack-dev-server in development mode

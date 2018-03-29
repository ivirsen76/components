import createHistory from 'history/createBrowserHistory';

const Boilerplate = window.cccisd.boilerplate;

export default createHistory({
    basename: Boilerplate.settings.currentUri,
});

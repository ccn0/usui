(function () {
    var dkjs = document.createElement('script');
    dkjs.src = 'https://usui.qog.app/dk/dk.js';
    document.body.appendChild(dkjs);

    var usuicss = document.createElement('link');
    usuicss.rel = "stylesheet";
    usuicss.href = 'https://usui.qog.app/dk/dk.css';
    document.head.appendChild(usuicss);

    dkjs.onload = ()=>{
        DK.load(DK.keyboards.gdcR, {bottom:"0",keyFontSize:"150%"})
    };
})();
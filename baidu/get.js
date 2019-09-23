function i(e) {

    function n(e) {
        e.data.callback = e.jsonp + o();
        return i(e.data)
    }

    function i(e) {
        var t = [];
        for (var n in e)
            e.hasOwnProperty(n) && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
        return t.push("v=" + o()),
            t.push("t=" + (new Date).getTime()),
            t.join("&")
    }

    function o() {
        return Math.floor(1e4 * Math.random() + 500)
    }
    return n(e)
}

function getAk() {
    var t = {};
    t.ak = '1e3f2dd1c81f2075171a547893391274';
    var f = i({
        jsonp: "jsonpCallbackA1",
        data: t,
    });
    return f
}


// console.log(getTk())
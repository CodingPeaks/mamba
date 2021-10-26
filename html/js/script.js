
$(document).ready(function () {

    $(".icon-spot").css("opacity", 1);
    $("#header-title").css("color", "white");

    particlesJS("particles-js", { "particles": { "number": { "value": 160, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#000000" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 1, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#000000", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 600 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 3 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true }); var count_particles, update; count_particles = document.querySelector('.js-count-particles'); update = function () { requestAnimationFrame(update); }; requestAnimationFrame(update);;

});

function login() {
    event.preventDefault();
    var login_ok = false;
    var usr = $("#login-username").val();
    var pwd = $("#login-password").val();

    if (usr == "admin" && pwd == "admin") {
        login_ok = true;
    }

    if (login_ok) {

        $(".sidebar-icon").click(function () {

            var current = $("#header-title").text();
            var clicked = $(this).data("page");

            if (clicked != current) {
                const page = clicked.toLowerCase();
                changePage(page);
            }

        });

        notify("Login", "Login success", 4000, 1);
        changePage("dashboard");
    } else {
        notify("Login", "Login failed", 4000, 0);
        $(".mamba-logo").css({ "animation": "shake 0.5s", "animation-iteration-count": "1" });
        setTimeout(function () { $(".mamba-logo").css({ "animation": "none" }) }, 500);
    }
}

function notify(header, body, delay, result) {
    if (result) {
        var snake_icon = "img/green-snake.png";
    } else {
        var snake_icon = "img/red-snake.png";
    }

    $("#toast-snake-icon").attr("src", snake_icon);

    $("#toast-header-text").text(header);
    $("#toast-body-text").text(body);

    var hms = getTime();

    $("#toast-time").text(hms);
    $(".toast").data("delay", delay);
    $(".toast").toast("show");
}

function changePage(page) {
    console.log("show page "+page);
    $(".page").css("opacity", 0);
    setTimeout(function () { showPage(page) }, 200);
}

function showPage(page) {
    changeHeaderTitle(page);
    $("#" + page).css("opacity", 1);
}

function changeHeaderTitle(page) {
    $("#header-title").css("opacity", 0);

    setTimeout(function () {
        $("#header-title").text(page);
    }, 100);

    setTimeout(function () {
        $("#header-title").css("opacity", 1);
    }, 200);
}

function listUsers() {
    $.getJSON('/listUsers', function (json) {
        console.log(json);
    });
}

function listShares() {
    $.getJSON('/listShares', function (json) {
        console.log(json);
    });
}

function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return h + ":" + m + ":" + s;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
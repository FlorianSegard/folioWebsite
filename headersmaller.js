window.onscroll = function() {
    var header = document.querySelector('header');
    if (window.pageYOffset > 50) {
        header.classList.add('small-header');
    } else {
        header.classList.remove('small-header');
    }
};
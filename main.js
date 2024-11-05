document.addEventListener("DOMContentLoaded", () => {
    const scroll = document.querySelector(".scroll");
    const scrollBehaviour = () => scroll.style.transform = `scale(${window.scrollY / window.scrollMaxY}, 1)`;
    window.ontouchmove = () => scrollBehaviour();
    window.onscroll = () => scrollBehaviour();
    document.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });
    enableBalls();
    enableAbout();
});
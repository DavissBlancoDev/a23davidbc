document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop(); // Ej: 'home.html'

    document.querySelectorAll(".navbar .nav-link").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active-page");
        } else {
            link.classList.remove("active-page");
        }
    });
});
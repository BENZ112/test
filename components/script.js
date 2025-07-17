const linkItems = document.querySelectorAll(".link-item");
linkItems.forEach((linkItems, index) => {
    linkItems.addEventListener("click", () => {
        document.querySelector(".active").classList.remove(".active");
    linkItems.classList.add(".active");

    const indicator = document.querySelector(".indicator");

    indicator.computedStyleMap.left = `${index * 95 + 48}px`;
    })
})
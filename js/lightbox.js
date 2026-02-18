let playlist = [],
    currentIndex = 0,
    touchStartX = 0,
    touchEndX = 0,
    isAnimating = !1,
    containers = [];
document.addEventListener("DOMContentLoaded", () => {
    playlist = document.querySelectorAll(".video a[data-youtube-id]");
    const e = document.querySelector(".lightbox-container"),
        t = e.cloneNode(!0);
    document.getElementById("video-lightbox").appendChild(t),
        (containers = [e, t]),
        e.classList.add("lc-active"),
        setupContainerEvents(e),
        setupContainerEvents(t);
    const n = document.getElementById("dateDivy");
    n && (n.textContent = new Date().getFullYear()),
        document.getElementById("video-lightbox").addEventListener("click", closeLightbox),
        document.addEventListener("keydown", (e) => {
            document.getElementById("video-lightbox").classList.contains("active") &&
                ("ArrowRight" === e.key && changeVideo(1),
                "ArrowLeft" === e.key && changeVideo(-1),
                "Escape" === e.key && closeLightbox());
        }),
        document.addEventListener(
            "touchstart",
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
            },
            { passive: !0 }
        ),
        document.addEventListener(
            "touchend",
            (e) => {
                if (!document.getElementById("video-lightbox").classList.contains("active")) return;
                touchEndX = e.changedTouches[0].screenX;
                Math.abs(touchStartX - touchEndX) > 50 && changeVideo(touchStartX > touchEndX ? 1 : -1);
            },
            { passive: !0 }
        );
});
function setupContainerEvents(e) {
    e.querySelector(".lightbox-close").addEventListener("click", closeLightbox),
        e.addEventListener("click", (e) => {
            e.stopPropagation();
        });
}
document.addEventListener("click", function (e) {
    const t = e.target.closest(".video a");
    t &&
        t.getAttribute("data-youtube-id") &&
        (e.preventDefault(), (currentIndex = Array.from(playlist).indexOf(t)), openLightbox(currentIndex));
});
function loadContent(e, t) {
    if (t < 0 || t >= playlist.length) return;
    const n = playlist[t];
    (e.querySelector("#lb-title").innerText = n.querySelector("h4").innerText),
        (e.querySelector("#lb-desc").innerText = n.getAttribute("data-desc") || ""),
        (e.querySelector("#lb-link").href = n.getAttribute("href")),
        (e.querySelector("#lb-iframe").src =
            "https://www.youtube.com/embed/" +
            n.getAttribute("data-youtube-id") +
            "?autoplay=1&rel=0&vq=hd1080&modestbranding=1");
}
function openLightbox(e) {
    const t = document.querySelector(".lightbox-container.lc-active");
    loadContent(t, e),
        document.getElementById("video-lightbox").classList.add("active"),
        (document.body.style.overflow = "hidden");
}
function changeVideo(e) {
    if (isAnimating) return;
    isAnimating = !0;
    let t = currentIndex + e;
    t >= playlist.length && (t = 0), t < 0 && (t = playlist.length - 1), (currentIndex = t);
    const n = document.querySelector(".lightbox-container.lc-active"),
        o = containers.find((e) => e !== n);
    loadContent(o, currentIndex),
        o.classList.add(1 === e ? "set-pos-right" : "set-pos-left"),
        void o.offsetWidth,
        o.classList.remove("set-pos-right", "set-pos-left"),
        n.classList.add(1 === e ? "anim-out-left" : "anim-out-right"),
        n.classList.remove("lc-active"),
        o.classList.add("lc-active"),
        setTimeout(() => {
            (n.querySelector("#lb-iframe").src = ""),
                n.classList.remove("anim-out-left", "anim-out-right"),
                (isAnimating = !1);
        }, 600);
}
function closeLightbox() {
    const e = document.getElementById("video-lightbox");
    e.classList.remove("active"),
        setTimeout(() => {
            containers.forEach((e) => (e.querySelector("#lb-iframe").src = ""));
        }, 300),
        (document.body.style.overflow = "auto");
}

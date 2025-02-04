const currentURL = window.location.href;

function copyURL(shareLink) {
    navigator.clipboard.writeText(currentURL);
    const toast = document.querySelector("[data-copy-toast]");
    toast && (toast.style.display = "block", setTimeout(() => {
        toast.style.display = "none"
    }, 2e3))
}
async function messageShare() {
    try {
        await navigator.share({
            url: currentURL
        })
    } catch (error) {
        console.log("Sharing failed!", error)
    }
}

function dataAccordion() {
    let accordionItems = document.querySelectorAll("[data-section-heading]");
    accordionItems && accordionItems.forEach(function(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            let targetList = item.nextElementSibling;
            targetList.classList.contains("image-with-text__text") && (targetList.style.maxHeight ? (targetList.style.maxHeight = null, setTimeout(() => {
                item.classList.add("section-heading--collapsed")
            }, 300)) : (item.classList.remove("section-heading--collapsed"), targetList.style.maxHeight = targetList.scrollHeight + "px"))
        })
    })
}
document.addEventListener("DOMContentLoaded", () => {
    dataAccordion(), document.querySelectorAll("[data-share-link]").forEach(function(shareLink) {
        shareLink.addEventListener("click", function(event) {
            copyURL(shareLink)
        })
    });
    const mobileAtcActions = document.querySelector("[data-mobile-atc-actions]"),
        mobileAtcBtn = document.querySelector("[data-mobile-atc]"),
        mobileShareBtn = document.querySelector("[data-mobile-share]"),
        mobileAtcPopup = document.querySelector("[data-mobile-atc-popup]"),
        mobileSharePopup = document.querySelector("[data-mobile-share-popup]"),
        mobileAtcPopupBg = document.querySelector("[data-mobile-atc-popup-bg]"),
        mobileAtcPopupClose = document.querySelector("[data-mobile-atc-popup-close]"),
        mobileSharePopupClose = document.querySelector("[data-mobile-share-popup-close]");

    function toggleDrawer(drawer, height) {
        let isOpen = drawer.clientHeight > 0;
        drawer.style.height = isOpen ? "0" : height, mobileAtcPopupBg.style.display = isOpen ? "none" : "block", document.body.style.overflow = isOpen ? "" : "hidden"
    }
    mobileAtcBtn.addEventListener("click", () => toggleDrawer(mobileAtcPopup, "75vh")), mobileShareBtn.addEventListener("click", () => toggleDrawer(mobileSharePopup, "170px")), mobileAtcPopupClose.addEventListener("click", () => toggleDrawer(mobileAtcPopup, "75vh")), mobileSharePopupClose.addEventListener("click", () => toggleDrawer(mobileSharePopup, "170px"));
    const scrollPositionToShow = 1e3;

    function handleScroll() {
        mobileAtcActions.toggleAttribute("hidden", window.scrollY < scrollPositionToShow);
    }
    window.addEventListener("scroll", handleScroll), handleScroll();
    
    const buyNowButton = document.querySelector(".button.alt");
    buyNowButton && buyNowButton.addEventListener("click", () => {
        // 클릭 시 바로 /cart.html로 이동
        window.location.href = "/cart.html";
    });
});
//# sourceMappingURL=/cdn/shop/t/167/assets/product.js.map?v=105276480630332585691730367687
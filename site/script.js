console.log("Þingvallavatn — kynningar- og stuðningssíða er keyrð.");

const previewButton = document.getElementById("preview-button");
const supportButton = document.getElementById("support-button");

if (previewButton) {
  previewButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("sneak-peek").scrollIntoView({ behavior: "smooth" });
  });
}

if (supportButton) {
  supportButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("leggja-lid").scrollIntoView({ behavior: "smooth" });
  });
}

const galleryScroll = document.querySelector(".gallery-scroll");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");

if (galleryScroll && galleryPrev && galleryNext) {
  const scrollStep = () => {
    const item = galleryScroll.querySelector(".gallery-item");
    const gap = parseFloat(getComputedStyle(galleryScroll).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  galleryPrev.addEventListener("click", () => {
    galleryScroll.scrollBy({ left: -scrollStep(), behavior: "smooth" });
  });

  galleryNext.addEventListener("click", () => {
    galleryScroll.scrollBy({ left: scrollStep(), behavior: "smooth" });
  });

  galleryScroll.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      galleryScroll.scrollLeft += event.deltaY;
    }
  });
}

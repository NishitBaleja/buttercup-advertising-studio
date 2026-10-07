document.addEventListener("DOMContentLoaded", () => {
    const videoBox = document.querySelector(".video-box");
    if (videoBox) {
        videoBox.addEventListener("click", () => {
            console.log("Playing video modal...");
        });
    }
});

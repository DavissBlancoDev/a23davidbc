// profile.js
document.addEventListener('DOMContentLoaded', () => {
  const profileMenu = document.querySelector(".profile-menu");
  const profileBtn = document.querySelector(".profile-btn");

  if (profileMenu && profileBtn) {
    profileBtn.addEventListener("click", () => {
      profileMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("active");
      }
    });
  }
});

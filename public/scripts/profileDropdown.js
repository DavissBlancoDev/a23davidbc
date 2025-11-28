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

  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = 'index.html';
    });
  }
});

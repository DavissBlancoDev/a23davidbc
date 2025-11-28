document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/usuarios/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.error);

  alert("Registro completado. Ahora inicia sesión.");
  window.location.href = "login.html";
});

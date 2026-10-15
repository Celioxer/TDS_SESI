document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    observeReveal();
    const imageInput = document.getElementById("post-image");
    if (imageInput) {
        imageInput.addEventListener("change", function() {
            const preview = document.getElementById("image-preview");
            if (!preview) return;
            preview.innerHTML = "";
            const file = this.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function() {
                    const img = document.createElement("img");
                    img.src = reader.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function addPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("contentt").value;
    const imageInput = document.getElementById("post-image");

    if (!title || !content) {
        alert("Preencha título e conteúdo.");
        return;
    }

    const post = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString(),
        image: null
    };

    const file = imageInput && imageInput.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 2MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function() {
            post.image = reader.result;
            savePost(post);
        };
        reader.readAsDataURL(file);
    } else {
        savePost(post);
    }
}

function savePost(post) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    document.getElementById("title").value = "";
    document.getElementById("contentt").value = "";
    const imageInput = document.getElementById("post-image");
    if (imageInput) {
        imageInput.value = "";
        const preview = document.getElementById("image-preview");
        if (preview) preview.innerHTML = "";
    }

    if (document.getElementById("posts-container")) {
        loadPosts();
    } else {
        window.location.href = "index.html";
    }
}

function loadPosts() {
    const container = document.getElementById("posts-container");
    if (!container) return;

    container.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    if (posts.length === 0) {
        container.innerHTML = '<div class="posts-empty"><p>Nenhuma postagem ainda. Seja o primeiro a compartilhar uma novidade sobre Witmarsum.</p><a href="newpost.html" class="btn">Publicar a primeira</a></div>';
        return;
    }

    posts.reverse().forEach(post => {
        const postElement = document.createElement("article");
        postElement.classList.add("post", "reveal");

        const title = document.createElement("h3");
        title.textContent = post.title;

        const date = document.createElement("small");
        date.textContent = post.date;

        if (post.image) {
            const img = document.createElement("img");
            img.src = post.image;
            img.alt = post.title;
            img.className = "post-thumbnail";
            postElement.appendChild(img);
        }

        postElement.appendChild(title);
        postElement.appendChild(date);

        const buttons = document.createElement("div");
        buttons.className = "post-buttons";
        buttons.innerHTML = `
            <a href="post.html?id=${post.id}">
                <button class="btn">Ver postagem</button>
            </a>
            <button class="btn btn-danger" onclick="deletePost(${post.id})">Deletar</button>
        `;
        postElement.appendChild(buttons);

        container.appendChild(postElement);
    });

    observeReveal();
}

function deletePost(id) {
    const confirmDelete = confirm("Tem certeza que deseja deletar esta postagem?");

    if (!confirmDelete) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.filter(post => post.id !== id);

    localStorage.setItem("posts", JSON.stringify(posts));

    loadPosts();
}

/* ========== NAVBAR / MENU ========== */
function setupNavbar() {
    const navbar = document.getElementById("navbar");
    const toggle = document.getElementById("nav-toggle");
    const links = navbar.querySelectorAll(".nav-menu a");

    // Destaque do link da página atual
    const current = window.location.pathname.split("/").pop() || "index.html";
    links.forEach(link => {
        const href = link.getAttribute("href");
            if (href === current || (current === "post.html" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // Navbar compacta ao rolar
    const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle) {
        toggle.addEventListener("click", () => {
            const open = navbar.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open);
            toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        });

        // Fecha o menu ao navegar
        links.forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }
}

/* ========== ANIMAÇÃO DE ENTRADA ========== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function observeReveal() {
    const items = document.querySelectorAll(".reveal:not(.visible)");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${Math.min(index * 60, 300)}ms`;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => observer.observe(item));
}

/* ========== FAVICON ========== */

fetch("./partials/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
        setupNavbar();
    });

fetch("./partials/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });

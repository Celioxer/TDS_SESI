document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
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
        container.innerHTML = '<p style="color: var(--text-muted); padding: 24px; text-align: center;">Nenhuma postagem ainda. Seja o primeiro a publicar!</p>';
        return;
    }

    posts.reverse().forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const imageHtml = post.image
            ? `<img src="${post.image}" alt="${post.title}" class="post-thumbnail">`
            : "";

        postElement.innerHTML = `
            ${imageHtml}
            <h3>${post.title}</h3>
            <small>${post.date}</small>
            <div class="post-buttons">
                <a href="post.html?id=${post.id}">
                    <button class="btn">Ver postagem</button>
                </a>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">Deletar</button>
            </div>
        `;

        container.appendChild(postElement);
    });
}

function deletePost(id) {
    const confirmDelete = confirm("Tem certeza que deseja deletar esta postagem?");

    if (!confirmDelete) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.filter(post => post.id !== id);

    localStorage.setItem("posts", JSON.stringify(posts));

    loadPosts();
}

fetch("./partials/navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar").innerHTML = data;
    });

fetch("./partials/footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });

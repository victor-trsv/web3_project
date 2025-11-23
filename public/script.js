document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("commentForm");
    const nameInput = document.getElementById("commentName");
    const textInput = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");

    async function loadComments() {
        const res = await fetch("/comments");
        const comments = await res.json();
        list.innerHTML = ""; // очищаем старый список
        comments.forEach(addCommentToDOM);
    }

    loadComments(); // загрузка при старте

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        if (!name || !text) return;

        await fetch("/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, text })
        });

        nameInput.value = "";
        textInput.value = "";

        loadComments(); // перезагружаем список с сервера, чтобы id были правильные
    });

    function addCommentToDOM(comment) {
        const li = document.createElement("li");
        li.dataset.id = comment.id;

        li.innerHTML = `<b>${comment.name}, ${comment.date}:</b> ${comment.text} 
                        <button class="delete-btn" style="margin-left:10px;">Удалить</button>`;

        li.querySelector(".delete-btn").addEventListener("click", async () => {
            await fetch(`/comments/${comment.id}`, { method: "DELETE" });
            loadComments(); // обновляем список после удаления
        });

        list.appendChild(li);
    }
});

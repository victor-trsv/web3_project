document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("commentForm");
    const nameInput = document.getElementById("commentName");
    const textInput = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");

    // Загружаем комментарии при открытии страницы
    fetch("/comments")
        .then(res => res.json())
        .then(comments => comments.forEach(addCommentToDOM));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        if (!name || !text) return;

        const res = await fetch("/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, text })
        });

        const savedComment = await res.json();
        addCommentToDOM(savedComment);

        nameInput.value = "";
        textInput.value = "";
    });

    function addCommentToDOM(comment) {
        const li = document.createElement("li");
        li.innerHTML = `<b>${comment.name}, ${comment.date}:</b> ${comment.text}`;
        list.appendChild(li);
    }
});

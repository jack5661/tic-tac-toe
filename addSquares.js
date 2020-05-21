const board = document.querySelector("#board");

for (let i = 0; i < 9; i++) {
    let box = document.createElement("div");
    box.setAttribute("id", "box" + i);
    box.setAttribute("class", "squares");
    box.textContent = i;
    board.appendChild(box);
}
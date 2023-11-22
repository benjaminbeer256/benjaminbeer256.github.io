function generate_matrix() {
    let matrix = document.getElementById('matrix');
    let numStrings = parseInt((Math.random()) * 50 + 50);
    let i = 0;
    while (i < numStrings)
    {
        matrix.insertAdjacentHTML("afterend", "<text class=numbers>thisIstext</text>");
        i += 1;
    }
}
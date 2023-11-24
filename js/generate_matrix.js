function generate_matrix() {
    let matrix = document.getElementById('matrix');
    let numStrings = 30;
    let i = 0;
    while (i < numStrings)
    {
        if (Math.random() > 0.2){
            let string = "<text class=numbers style=\"right:" + (i + Math.random()) + "vw;font-size:" + (Math.random() / 4 + .7) + "vw;\">";
            let numNumbers = parseInt((Math.random()) * 40 + 50);
            let k = 0;
            while (k < numNumbers){
                string += parseInt(Math.random() + 0.5);
                k += 1;
            }
            matrix.insertAdjacentHTML("afterend", string + "</text>");
        }
        i += 0.75;
    }
}
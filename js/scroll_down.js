count = 0;
document.addEventListener("wheel", (event) => {
    count += 3;
    strips = document.getElementsByClassName('colorStrip');
    if (count < 99){
        for (i = 0; i < strips.length; i++) {
            strips[i].style.width = count + "%";
        }
    }
    if (count == 99){
        for (i = 0; i < strips.length; i++) {
            strips[i].style.width = "100%";
        }
        document.getElementsByTagName('body')[0].style.overflowY = "scroll";
        for (i = 0; i < strips.length; i++) {
            strips[i].style.height = "200%";
        }
        document.getElementById('downArrow').style.display = "none";
        document.getElementById('scrollDownText').style.display = "none";
        document.getElementById('dnaOne').style.display = "block";
        document.getElementById('dnaTwo').style.display = "block";
    }
})
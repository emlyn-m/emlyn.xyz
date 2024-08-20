function scale_name() {
    let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    fn_sy = document.getElementById("firstname").clientHeight / ((vw / 12.5) * document.getElementById("firstname").innerText.length);
    ln_sy = document.getElementById("lastname").clientHeight / ((vw / 12.5) * document.getElementById("lastname").innerText.length);
    document.getElementById("firstname").style.setProperty("--scale", fn_sy);
    document.getElementById("lastname").style.setProperty("--scale", ln_sy);
}

window.addEventListener("load", scale_name);
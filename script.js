'use strict';

let PROJ_IMG = document.getElementById("project-preview-img");
let PROJ_DSC = document.getElementById("project-preview-desc");

let PROJ_ENTRIES = document.getElementsByClassName("proj-entry");


let PROJ_DSC_MAPPING = {
    "Snapnote": "Snapnote",
    "roll.emlyn.xyz": "roll.emlyn.xyz",
    "NZPVT": "NZPVT",
}

function clearProjEntry() {
    PROJ_DSC.innerHTML = "\u200e ";
    // todo: set image
}

function projEntryHover(event) {
    PROJ_DSC.innerHTML = PROJ_DSC_MAPPING[event.target.innerText];
    // todo: set images once developed
}

function main() {
    for (var i=0; i < PROJ_ENTRIES.length; i++) {
        PROJ_ENTRIES[i].addEventListener("mouseover", projEntryHover)
        PROJ_ENTRIES[i].addEventListener("mouseout", clearProjEntry);
    }
}

main()
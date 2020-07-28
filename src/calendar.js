window.onload = function () {

    let ch = document.getElementById("calendar-holder");

    let str =
        `   
        
<div class="cal-head-holder">
<div class="cal-left"><</div>
<div class="cal-right">></div>
<div class="cal-month">Июль 2020</div>


</div>`
    str += `<div class="table-holder">`
    str += `<table class="days-table">`

    str += `<tr>`
    for (let i = 0; i < 7; i++) {
        str += `<th>` + i + `</th>`
    }
    str += `</tr>`

    let days_cou = 1

    for (let row = 0; row < 7; row++) {
        str += `<tr>`
        for (let i = 0; i < 7; i++) {
            str += `<td>` + days_cou++ + `</td>`
        }
        str += `</tr>`
    }



    str += `</div>`;
    ch.innerHTML = str;


}           
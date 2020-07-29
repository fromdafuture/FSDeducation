class DateChooser {
    constructor(CalendarHolder) {
        this.calendarHolder = CalendarHolder;
        let curDay = new Date();
        this.monthShown = curDay.getMonth();
        this.firstDay = curDay;
        this.lastDay = curDay;
        this.redraw();
    };


    createDays(monthDate){

    }


    createMonth(monthDate) {
        let firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0);

        let curMonthNumber = monthDate.getMonth();
        let curMonthDay = monthDate.getDate();
        let curMonthName = monthDate.toLocaleString('ru-RU', { month: 'long' });
        curMonthName = curMonthName[0].toUpperCase() + curMonthName.slice(1);
        let curMonthYear = monthDate.getFullYear();


        let lastDay = this.getLastDayOfMonth(monthDate.getYear(), monthDate.getMonth());
        let lastMonthLastDay = this.getLastDayOfMonth(monthDate.getYear(), monthDate.getMonth() - 1);

        let firstWeekDay = firstDay.getDay() - 1;
        if (firstWeekDay < 0)
            firstWeekDay = 6;
        let lastMonthFirstVisibleDay = -1;
        if (firstWeekDay > 0)
            lastMonthFirstVisibleDay = lastMonthLastDay - firstWeekDay;


        let str = `
<div class="cal-head-holder">
    <div class="cal-left"><</div>
    <div class="cal-right">></div>
    <div class="cal-month">` + curMonthName + ` ` + curMonthYear + `</div>
</div>
<div class="table-holder">
    <table class="days-table">
        <tr>
            <th class="th-cell">Пн</th><th class="th-cell">Вт</th>
            <th class="th-cell">Ср</th>
            <th class="th-cell">Чт</th>
            <th class="th-cell">Пт</th>
            <th class="th-cell">Сб</th>
            <th class="th-cell">Вс</th>
        </tr>`


        let days_cou = 1
        let i = 0
        let row = 0
        str += `<tr>`
        if (lastMonthFirstVisibleDay > -1) {
            for (days_cou = lastMonthFirstVisibleDay; days_cou <= lastMonthLastDay; days_cou++)
                str += `<td class="td-cell td-cell-grayed"> ` + days_cou + `</td>`

            for (days_cou = 1; days_cou < 7 - (lastMonthLastDay - lastMonthFirstVisibleDay); days_cou++)
                str += `<td class="td-cell">` + days_cou + `</td>`
            str += `</tr>`
            row = 1
        }

        for (; row++ < 5;) {
            str += `<tr>`
            for (i = 0; i < 7; i++) {
                let closingClassStr = ""
                if (days_cou == curMonthDay)
                    closingClassStr += `td-cell-today `
                if (days_cou > lastDay) {
                    days_cou = 1;
                    closingClassStr += `td-cell-grayed `
                }
                str += `<td class="td-cell ` + closingClassStr + `">` + days_cou + `</td> `
                days_cou++;
            }
            str += `</tr> `
        }
        str += 
        `</table> 
        <div> 
        <div class="cal-clear" >Очистить</div>
            <div class="cal-submit">Применить</div>`
        return str;
    }

    getLastDayOfMonth(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
    };

    redraw() {



        let curDay = new Date(2019, 7, 8);

        this.calendarHolder.innerHTML = this.createMonth(curDay);
    };
}


var dateChooser;

window.onload = function () {

    let ch = document.getElementById("calendar-holder");

    dateChooser = new DateChooser(ch);
}           
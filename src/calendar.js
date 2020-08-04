class DateChooser {
    constructor(CalendarHolder) {
        this.calendarHolder = CalendarHolder;
        let curDay = new Date();
        this.monthShown = curDay.getMonth();
        this.firstDay = curDay;
        this.lastDay = curDay;


        this.initDivs();

        this.render();
    };

    initDivs() {

    }
    
    render() {
        let curDay = new Date(2019, 7, 8);
        this.calendarHolder.innerHTML = this.createMonth(curDay);
    };

    createMonth(monthDate) {
        let curMonthName = monthDate.toLocaleString('ru-RU', { month: 'long' });
        curMonthName = curMonthName[0].toUpperCase() + curMonthName.slice(1);
        let curMonthYear = monthDate.getFullYear();

        let str = `
        <div class="cal-head-holder">
            <div class="cal-left"><</div>
            <div class="cal-right">></div>
            <div class="cal-month">` + curMonthName + ` ` + curMonthYear + `</div>
        </div>
        <div class="table-holder">
            <table class="days-table">
                <tr>
                    <th class="th-cell">Пн</th>
                    <th class="th-cell">Вт</th>
                    <th class="th-cell">Ср</th>
                    <th class="th-cell">Чт</th>
                    <th class="th-cell">Пт</th>
                    <th class="th-cell">Сб</th>
                    <th class="th-cell">Вс</th>
                </tr>`

        let curDay = new Date();
        let datesGenerator = new DatesGenerator(curDay);
        str += datesGenerator.render(curDay);

        str +=
            `</table> 
            <div> 
            <div class="cal-clear">Очистить</div>
            <div class="cal-submit">Применить</div>`
        return str;
    }

    getLastDayOfMonth(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
    };


}


var dateChooser;

window.onload = function () {

    let ch = document.getElementById("calendar-holder");

    dateChooser = new DateChooser(ch);
}


class DatesGenerator {
    constructor(theDate) {
        this.firstDate = new Date(2020, 6, 29);
        this.lastDate = new Date(2020, 7, 5);
        this.days = [];
        this.genDays(theDate);
    }

    genDays(date) {
        this.days.length = 0;

        let curMFirstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
        if (curMFirstDay < 0) curMFirstDay = 6;

        if (curMFirstDay > 0) {
            let lastMonthDaysQua = curMFirstDay;
            let lastMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate() - lastMonthDaysQua + 1;
            for (let i = 0; i < lastMonthDaysQua; i++) {
                let newDate = new Date(date.getFullYear(), date.getMonth() - 1, lastMonthFirstDay + i);
                this.days.push(new Day(newDate, false, this.checkInPeriod(newDate)));
            }
        }

        let curMonthDaysQua = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 1; i <= curMonthDaysQua; i++) {
            let newDate = new Date(date.getFullYear(), date.getMonth(), i);

            this.days.push(new Day(newDate, true, this.checkInPeriod(newDate)));
        }

        let curMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay() - 1;
        if (curMonthLastDay < 0) curMonthLastDay = 6;
        if (curMonthLastDay < 6) {
            for (let i = 1; i < 7 - curMonthLastDay; i++) {
                let newDate = new Date(date.getFullYear(), date.getMonth() + 1, i);

                this.days.push(new Day(newDate, false, this.checkInPeriod(newDate)));
            }
        }
    }

    checkInPeriod(date) {
        if (date < this.firstDate || date > this.lastDate)
            return 0;
        if (date > this.firstDate && date < this.lastDate)
            return 3;
        if (checkIfSameDay(date, this.lastDate))
            return 2;
        if (checkIfSameDay(date, this.firstDate))
            return 1;

    }

    render() {
        let str = "";
        let d = 0;
        for (let i = 0; i < 6; i++) {
            str += "<tr>";
            for (let j = 0; j < 7; j++) {
                let aDay = this.days[d];
                str += '<td class="td-cell';

                if (aDay.isCurrentDay)
                    str += " td-cell-today";
                if (aDay.isInPeriod == 1)
                    str += " td-cell-first";
                if (aDay.isInPeriod == 2)
                    str += " td-cell-last";
                if (aDay.isInPeriod == 3)
                    str += " td-cell-inside";
                if (!aDay.isInMonth)
                    str += " td-cell-grayed";
                str += '">'
                str += aDay.dayString;
                str += "</td>"
                d++;
            }
            str += "</tr>";
        }

        return str;
    }


}

class Day {
    constructor(date, isInMonth, isInPeriod) {
        this.date = date;
        this.isInMonth = isInMonth;
        this.isInPeriod = isInPeriod;
    }

    get isCurrentDay() {
        const today = new Date();
        return checkIfSameDay(this.date, today);
    }

    get dayString() {
        return this.date.getDate().toString();
    }

    toString() {
        return this.isCurrentDay ?
            this.isInMonth ? `<b><u> ${this.date.getDate()} </u> </b>` : this.date.getDate() :
            this.isInMonth ? `<b> ${this.date.getDate()} </b>` : this.date.getDate();
    }
}

let checkIfSameDay = function (day1, day2) {
    return day1.getFullYear() == day2.getFullYear() && day1.getMonth() == day2.getMonth() && day1.getDate() == day2.getDate();
}
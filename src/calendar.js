window.onload = function () {
    new DateChooser("#calendar-holder");
}


class DateChooser {
    constructor(calendarHolder) {
        let curDay = new Date();
        this.monthShown = curDay;
        this.firstDay = curDay;
        this.lastDay = curDay;

        this.$calendarHolder = document.querySelector(calendarHolder);

        this.initDivs();

        this.$monthYearHolder = this.$calendarHolder.querySelector("#calender__month");
        this.$daysTable = this.$calendarHolder.querySelector("#calendar__days-holder");

        this.$calendarHolder.querySelector("#cal-left").addEventListener("click", () => { this.showPreviousMonth(this) });
        this.$calendarHolder.querySelector("#cal-right").addEventListener("click", () => { this.showNextMonth(this) });
        this.render();
    };

    showPreviousMonth(thisobj) {
        thisobj.monthShown = new Date(thisobj.monthShown.getFullYear(), thisobj.monthShown.getMonth() - 1);
        thisobj.render("left");
    };

    showNextMonth(thisobj) {
        thisobj.monthShown = new Date(thisobj.monthShown.getFullYear(), thisobj.monthShown.getMonth() + 1);
        thisobj.render("right");
    };

    initDivs() {
        this.$calendarHolder.innerHTML = `
        <div class="cal-head-holder">
            <div id="cal-left"><</div>
            <div id="cal-right">></div>
            <div id="calender__month" class="cal-month">Месяц 2025</div>
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
                </tr>
            </table> 
            <div id="calendar__days-holder">
  
            </div>
            <div> 
            <div class="cal-clear">Очистить</div>
            <div class="cal-submit">Применить</div>`;
    };

    render(leftOrRight) {
        let monthDate = this.monthShown;

        let curMonthName = monthDate.toLocaleString('ru-RU', { month: 'long' });
        curMonthName = curMonthName[0].toUpperCase() + curMonthName.slice(1);
        let curMonthYear = monthDate.getFullYear();
        this.$monthYearHolder.innerHTML = curMonthName + ` ` + curMonthYear;

        let datesGenerator = new DatesGenerator(this.monthShown);




        //this.$daysTable.innerHTML = datesGenerator.render();

        let newEl = document.createElement("div");
        newEl.innerHTML = datesGenerator.render();
        newEl.classList.add("days-table-insertion");

        if (leftOrRight == "left") {
            this.$daysTable.append( newEl);
        }
        else {
            this.$daysTable.prepend(newEl);
        }
    };



    getLastDayOfMonth(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
    };
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

        let daysLeftToFill = 43 - this.days.length;

        for (let i = 1; i < daysLeftToFill; i++) {
            let newDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
            this.days.push(new Day(newDate, false, this.checkInPeriod(newDate)));
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
        let str = `<table class='days-table'>`;
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
        str += "</table>";
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
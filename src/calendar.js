window.onload = function () {
    new DateChooser("#calendar-holder");
}


class DateChooser {
    constructor(calendarHolder) {
        this.$calendarHolder = document.querySelector(calendarHolder);

        let curDate = new Date();
        this.monthShown = curDate;
        this.firstDate = NaN;
        this.lastDate = NaN;

        this.initDivs();

        this.$monthYearHolder = this.$calendarHolder.querySelector("#calender__month");
        this.$daysTable = this.$calendarHolder.querySelector("#calendar__days-holder");

        this.$calendarHolder.querySelector("#cal-left").addEventListener("click", () => { this.showPreviousMonth(this) });
        this.$calendarHolder.querySelector("#cal-right").addEventListener("click", () => { this.showNextMonth(this) });

        this.mouseIsDown = false;

        this.$daysTable.addEventListener("click", e => this.mouseclick(e));

        this.$daysTable.addEventListener("mousemove", e => this.mousemovement(e));

        this.$daysTable.addEventListener("mousedown",
            e => { if (e.target.classList.contains("td-cell")) { this.mouseIsDown = true; } });

        this.$daysTable.addEventListener("mouseup", () => { this.mouseIsDown = false; });

        this.$daysTable.addEventListener("mouseleave", () => { this.mouseIsDown = false; });

        this.render();
    };

    mouseclick(e) {
        this.mouseIsDown = true;
        this.mousemovement(e);
        this.mouseIsDown = false;
    }

    mousemovement(e) {
        let el = e.target;
        if (el.classList.contains("td-cell")) {
            if (this.mouseIsDown) {
                let day = el.innerText;
                let month = !el.classList.contains("td-cell-grayed") ?
                    this.monthShown.getMonth() :
                    (el.parentElement.rowIndex < 3 ? this.monthShown.getMonth() - 1 :
                        this.monthShown.getMonth() + 1);
                let year = this.monthShown.getFullYear();
                let aDate = new Date(year, month, day);
                if (!this.firstDate) {
                    this.firstDate = aDate;
                    this.lastDate = aDate;
                }
                if (aDate < this.firstDate) this.firstDate = aDate;
                else if (aDate > this.lastDate) this.lastDate = aDate;
                else if (aDate > this.firstDate && aDate < this.lastDate) {
                    if (aDate - this.firstDate < this.lastDate - aDate)
                        this.firstDate = aDate;
                    else
                        this.lastDate = aDate;
                }
                this.render();
            }
        }
    }

    clearDays() {


    }

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


    showPreviousMonth(thisobj) {
        thisobj.monthShown = new Date(thisobj.monthShown.getFullYear(), thisobj.monthShown.getMonth() - 1);
        thisobj.render("left");
    };

    showNextMonth(thisobj) {
        thisobj.monthShown = new Date(thisobj.monthShown.getFullYear(), thisobj.monthShown.getMonth() + 1);
        thisobj.render("right");
    };

    render(leftOrRight) {
        let monthDate = this.monthShown;

        let curMonthName = monthDate.toLocaleString('ru-RU', { month: 'long' });
        curMonthName = curMonthName[0].toUpperCase() + curMonthName.slice(1);
        let curMonthYear = monthDate.getFullYear();
        this.$monthYearHolder.innerHTML = curMonthName + ` ` + curMonthYear;

        let datesGenerator = new DatesGenerator(this.monthShown, this.firstDate, this.lastDate);
        this.$daysTable.innerHTML = datesGenerator.render();
    };
}

class DatesGenerator {
    constructor(theDate, firstDate, lastDate) {
        this.firstDate = firstDate;
        this.lastDate = lastDate;
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

        let daysLeftToFill = 43 - this.days.length;

        for (let i = 1; i < daysLeftToFill; i++) {
            let newDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
            this.days.push(new Day(newDate, false, this.checkInPeriod(newDate)));
        }

    }

    checkInPeriod(date) {
        if (!this.firstDate || !this.lastDate)
            return 0;
        if (date < this.firstDate || date > this.lastDate)
            return 0;
        if (date > this.firstDate && date < this.lastDate)
            return 3;
        if (checkIfSameDay(this.firstDate, this.lastDate))
            return 4;
        if (checkIfSameDay(date, this.firstDate))
            return 1;
        if (checkIfSameDay(date, this.lastDate))
            return 2;
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
                if(aDay.isInPeriod == 4)
                    str+= " td-cell-single";
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
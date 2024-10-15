function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(year, month) {
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
}

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    let totalWorkedDays = 0;

    const getWorkingDaysInMonth = (year, month) => {
        const daysInMonth = getDaysInMonth(year, month);
        let totalDays = 0, totalWorked = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();  // Sunday = 0, Monday = 1, ..., Friday = 5
            if (dayOfWeek !== 5) {
                totalDays++;
            }
            if (date >= start && date <= end && dayOfWeek !== 5) {
                totalWorked++;
            }
        }
        return { totalDays, totalWorked };
    };

    while (current <= end) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;

        const { totalDays, totalWorked } = getWorkingDaysInMonth(year, month);
        daysExcludingFridays.push(totalDays);
        daysWorkedExcludingFridays.push(totalWorked);
        totalWorkedDays += totalWorked;

        current.setMonth(current.getMonth() + 1);  // Move to the next month
    }

    // Proportionally distribute the totalAnnualTarget across the worked days in each month
    daysWorkedExcludingFridays.forEach(workedDays => {
        monthlyTargets.push((workedDays / totalWorkedDays) * totalAnnualTarget);
    });

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget: totalAnnualTarget
    };
}

// Example usage
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220);
console.log(result);
export function monthDiff(d1: Date, d2: Date) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

export function weeksDiff(startDate: Date, endDate: Date) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((endDate.getTime() - startDate.getTime()) / msInWeek);
}

export function daysDiff(startDate: Date, endDate: Date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInTime / oneDay);
    return diffInDays;
}

export function hoursDiff(startDate: Date, endDate: Date) {
    const oneHour = 1000 * 60 * 60;
    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInHours = Math.floor(diffInTime / oneHour);
    return diffInHours;
}

export function minutesDiff(startDate: Date, endDate: Date) {
    const oneMinute = 1000 * 60;
    const diffInTime = endDate.getTime() - startDate.getTime();
    const diffInMinutes = Math.floor(diffInTime / oneMinute);
    return diffInMinutes;
}

export const getTimeRemaining = (endDateString: string) => {

    const endDateNumber = Date.parse(endDateString)
    const endDate = new Date(endDateNumber)


    const todaysDate = new Date()

    const remainingMonths = monthDiff(todaysDate, endDate)
    const remainingWeeks = weeksDiff(todaysDate, endDate)
    const remainingDays = daysDiff(todaysDate, endDate)
    const remainingHours = hoursDiff(todaysDate, endDate)
    const remainingMinutes = minutesDiff(todaysDate, endDate)

    if (remainingMonths > 0) return `closes in ${remainingMonths} months`
    if (remainingWeeks > 0) return `closes in ${remainingWeeks} weeks`
    if (remainingDays > 1) return `closes in ${remainingDays} days`
    if (remainingDays > 0) return `closes tommorow`
    if (remainingHours > 0) return `closes in ${remainingHours} hours`
    if (remainingMinutes > 0) return `closes in ${remainingMinutes} minutes`
    if (remainingMinutes < 0) return `closed`
    
    return "closing soon"
}   

export const formatNumberToMoney = (number: number) => {
    // Create our number formatter.
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    
    return formatter.format(number);
}

export const formatDate = (dateString: string): string => {
    const dateNumber = Date.parse(dateString)
    const date = new Date(dateNumber)
    const today = new Date()

    const options = { 
        year: (date.getFullYear < today.getFullYear? "numeric" : undefined),
        month: "short", 
        weekday: "short", 
        day: "numeric", 
        hour: "numeric", 
        minute: "numeric" };
    // @ts-ignore
    const formatted = date.toLocaleDateString("en-NZ", options)

    return formatted;
}

export const formatDateNoDay = (dateString: string): string => {
    const dateNumber = Date.parse(dateString)
    const date = new Date(dateNumber)
    const today = new Date()

    const options = { 
        year: (date.getFullYear < today.getFullYear? "numeric" : undefined),
        month: "short",  
        day: "numeric", 
        hour: "numeric", 
        minute: "numeric" };
    // @ts-ignore
    const formatted = date.toLocaleDateString("en-NZ", options)

    return formatted;
}

export const getTodaysDate = (): Date => {
    const date = new Date()
    return date
}
// Calculate how long ago was the comment posted
export const timeAgo = (date) => {
    let formattedDate = new Date(date);
    let today = new Date();
    let seconds = Math.round((today - formattedDate) / 1000);
    let minutes = Math.round(seconds / 60);
    let hours = Math.round(minutes / 60);

    if (seconds < 10) {
        return `Now`;
    } else if (seconds < 60) {
        return `${seconds} seconds ago`
    } else if (seconds < 90) {
        return `A minute ago`
    } else if (minutes < 60) {
        return `${minutes} minutes ago`
    } else if (hours < 2) {
        return `An hour ago`
    } else if (hours < 24) {
        return `${hours} hours ago`
    } else {
        return dateToLocale(date)
    }
}

// Transform timestamp in a date format MM/DD/YYYY
export const dateToLocale = (date) => {
    const dateTime = new Date(date);
    return dateTime.toLocaleDateString();
}

export const timeToLocale = (date) => {
    const dateTime = new Date(date);
    return dateTime.toLocaleTimeString();
}
export function isLessThanADay(date: Date): boolean {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const messageCreationTime = date.getTime()
    const currentTime = (new Date()).getTime()
    return (currentTime - messageCreationTime) < day
}

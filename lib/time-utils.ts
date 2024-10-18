import dayjs from 'dayjs';
import 'dayjs/plugin/relativeTime';

dayjs.extend(require('dayjs/plugin/relativeTime'));

export function isLessThanADay(date: Date): boolean {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const messageCreationTime = date.getTime()
    const currentTime = (new Date()).getTime()
    return (currentTime - messageCreationTime) < day
}

export function getTimeSince(date: Date) {
    return dayjs().to(dayjs(date));
}

export const humanizeBotLastConnection = (time: number) => {
    if (time <= 60) {
        return `${Math.round(time)} sec.`;
    } else if (time <= 60*60) {
        return `${Math.round(time / 60)} min.`;
    } else if (time <= 60*60*24) {
        return `${Math.round(time / 60 / 60)} hours`;
    } else {
        return `${Math.round(time / 60 / 60 / 24)} days`;
    }
};

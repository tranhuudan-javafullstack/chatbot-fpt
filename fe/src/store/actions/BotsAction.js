export function saveBots(bots) {
    return {
        type: 'SAVE_BOTS',
        payload: bots,
    };
}
export function addBot(bot) {
    return {
        type: 'ADD_BOT',
        payload: bot,
    };
}
export function actionUpdateBot(bot) {
    return {
        type: 'UPDATE_BOT',
        payload: bot,
    };
}
export function actionDeleteBot(bot) {
    return {
        type: 'DELETE_BOT',
        payload: bot,
    };
}
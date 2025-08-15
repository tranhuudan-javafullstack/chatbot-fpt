const initialState = {
    bots: [],
};
export default function botsReducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_BOTS':
            return {
                ...state,
                bots: action.payload,
            };
        case 'ADD_BOT':
            return {
                ...state,
                bots: [...state.bots, action.payload],
            };
        case 'UPDATE_BOT':
            return {
                ...state,
                bots: state.bots.map(bot =>
                    bot.bot_id === action.payload.bot_id ? { ...bot, ...action.payload } : bot
                ),
            };
        case 'DELETE_BOT':
            return {
                ...state,
                bots: state.bots.filter(bot => bot.bot_id !== action.payload),
            };
        default:
            return state;
    }
}
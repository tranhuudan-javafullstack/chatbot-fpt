const initialState = {
    knowledges: [],
    currentFileOfKnowledge: null,
};
export default function knowledgesReducer(state = initialState, action) {
    switch (action.type) {
        case 'SAVE_KNOWLEDGES':
            return {
                ...state,
                knowledges: action.payload,
            };
        case 'ADD_KNOWLEDGE':
            return {
                ...state,
                knowledges: [...state.knowledges, action.payload],
            };
        case 'UPDATE_KNOWLEDGE':
            return {
                ...state,
                knowledges: state.knowledges.map(knowledge =>
                    knowledge.knowledge_id === action.payload.knowledge_id ? { ...knowledge, ...action.payload } : knowledge
                ),
            };
        case 'DELETE_KNOWLEDGE':
            return {
                ...state,
                knowledges: state.knowledges.filter(knowledge => knowledge.knowledge_id !== action.payload),
            };
        case 'SAVE_CURRENT_FILES':
            return {
                ...state,
                currentFileOfKnowledge: action.payload,
            };
        default:
            return state;
    }
}
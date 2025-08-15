export function saveKnowledges(knowledges) {
    return {
        type: 'SAVE_KNOWLEDGES',
        payload: knowledges,
    };
}
export function addKnowledge(knowledge) {
    return {
        type: 'ADD_KNOWLEDGE',
        payload: knowledge,
    };
}
export function actionUpdateKnowledge(knowledge) {
    return {
        type: 'UPDATE_KNOWLEDGE',
        payload: knowledge,
    };
}
export function actionDeleteKnowledge(knowledgeId) {
    return {
        type: 'DELETE_KNOWLEDGE',
        payload: knowledgeId,
    };
}
export function saveCurrentFiles(files) {
    return {
        type: 'SAVE_CURRENT_FILES',
        payload: files,
    };
}

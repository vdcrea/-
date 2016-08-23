export const setUser = makeAction('SET_USER')
export const setLang = makeAction('SET_LANG')

// brand actions
export const saveLogoItem = makeAction('SAVE_LOGO')
export const updateLogoItem = makeAction('UPDATE_LOGO')
export const removeLogoItem = makeAction('REMOVE_LOGO')

export const saveColorItem = makeAction('SAVE_COLOR')
export const updateColorItem = makeAction('UPDATE_COLOR')
export const removeColorItem = makeAction('REMOVE_COLOR')

export const saveImageItem = makeAction('SAVE_IMAGE')
export const updateImageItem = makeAction('UPDATE_IMAGE')
export const removeImageItem = makeAction('REMOVE_IMAGE')



export function loadState({dispatch, state}, loaded) {
    dispatch(Mutation.LOAD_STATE, loaded)
}

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
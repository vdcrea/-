export default {
    SET_USER (state, userInfo) {
        state.user = userInfo
    },
    SET_LANG (state, lang) {
        if (state.settings.locales.indexOf(lang) !== -1) {
            localStorage.setItem('lang', lang)
            state.settings.lang = lang
        }
    },

    SAVE_LOGO(state, newitem) {
        state.brand.logos.insert(newitem)
    },
    UPDATE_LOGO(state, newitem) {
        var item = state.brand.logos.findOne({"id":newitem.id});
            item = newitem
        state.brand.logos.update(item);
    },
    REMOVE_LOGO(state, id) { // color object in the form of { name: 'ratatosk', id: 'rata@tosk.r', age: 10320 }
        var item = state.brand.logos.findOne({"id":id});
        state.brand.logos.remove(item);
    },

    SAVE_COLOR(state, newitem) {
        state.brand.colors.insert(newitem)
    },
    UPDATE_COLOR(state, newitem) {
        var item = state.brand.colors.findOne({"$loki":newitem.$loki});
            item = newitem
        state.brand.colors.update(item);
    },
    REMOVE_COLOR(state, lid) { // color object in the form of { name: 'ratatosk', id: 'rata@tosk.r', age: 10320 }
        var item = state.brand.colors.findOne({"$loki":lid});
        state.brand.colors.remove(item);
    },

    SAVE_IMAGE(state, newitem) {
        state.brand.images.insert(newitem)
    },
    UPDATE_IMAGE(state, newitem) {
        var item = state.brand.images.findOne({"$loki":newitem.id});
            item = newitem
        state.brand.images.update(item);
    },
    REMOVE_IMAGE(state, id) { // color object in the form of { name: 'ratatosk', id: 'rata@tosk.r', age: 10320 }
        var item = state.brand.images.findOne({"$loki":id});
        state.brand.images.remove(item);
    }

}

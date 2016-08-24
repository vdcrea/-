export default {
    SET_USER (state, userInfo) {
        state.user = userInfo
    },
    SET_LANG (state, lang) {
        localStorage.setItem('lang', lang)
        state.settings.lang = lang
    },
    SET_BRAND (state, brand) {
        localStorage.setItem('brand', brand)
        state.settings.currentBrand = brand
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



    // save image
    SAVE_IMAGE(state, newitem) {
        state.images.insert(newitem)
    },
    UPDATE_IMAGE(state, newitem) {
        var item = state.images.findOne({"$loki":newitem.id});
            item = newitem
        state.images.update(item);
    },
    REMOVE_IMAGE(state, file) {
        var item = state.images.find({'file': file})
        state.images.remove(item);
    }

}

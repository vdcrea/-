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


    SAVE_DOC(state, newitem) {
        state.user.docs.insert(newitem)
    },
    UPDATE_DOC(state, newitem) {
        var item = state.user.docs.find({'$loki': newitem.$loki});
            item = newitem
        state.user.docs.update(item);
    },
    DELETE_DOC(state, id) {
        var item = state.user.docs.find({'$loki': id})
        state.user.docs.remove(item);
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


    // brands
    SAVE_BRAND(state, newitem) {
        state.user.brands.insert(newitem)
    },
    UPDATE_BRAND(state, newitem) {
        var item = state.user.brands.findOne({"id":newitem.id});
            item = newitem
        state.user.brands.update(item);
    },
    REMOVE_BRAND(state, id) { // color object in the form of { name: 'ratatosk', id: 'rata@tosk.r', age: 10320 }
        var item = state.user.brands.findOne({"id":id});
        state.user.brands.remove(item);
    },

    // logos
    SAVE_LOGO(state, newitem) {
        state.brand.logos.insert(newitem)
    },
    UPDATE_LOGO(state, newitem) {
        var item = state.brand.logos.find({"$loki":newitem.$loki});
            item = newitem
        state.brand.logos.update(item);
    },
    REMOVE_LOGO(state, name) {
        var item = state.brand.logos.find({'name': name});
        state.brand.logos.remove(item);
    },

    // images
    SAVE_IMAGE(state, newitem) {
        state.brand.images.insert(newitem)
    },
    UPDATE_IMAGE(state, newitem) {
        var item = state.brand.images.find({'$loki': newitem.$loki});
            item = newitem
        state.brand.images.update(item);
    },
    REMOVE_IMAGE(state, id) {
        var item = state.brand.images.find({'$loki': id})
        state.brand.images.remove(item);
    }

}

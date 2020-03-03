let siteData;

const setSiteData = (data) => {
    siteData = data;
}

const storagePrefix = function() {
    let p = siteData.base.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '.');
    return p ? p+'.' : '';
}

const setStorage = function(name, value) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage[storagePrefix() + name] = value;
}

const getStorage = function(name) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    name = storagePrefix() + name;
    if (typeof localStorage[name] === 'undefined') {
        return;
    }
    return localStorage[name];
}

export {
    setSiteData,
    storagePrefix,
    getStorage,
    setStorage
}

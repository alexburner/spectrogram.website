export const getHashUrl = ():string => {
    const hash = (
        window.location.hash.length &&
        window.location.hash.slice(1)
    );

    let url:string;
    if (!hash || !hash.length) {
        url = '';
    }
    else if (hash.indexOf('https://') === 0) {
        url = hash;
    }
    else if (hash.indexOf('http://') === 0) {
        url = `https://${hash.slice(7)}`;
    }
    else if (hash.indexOf('//') === 0) {
        url = `https:${hash}`;
    }
    else {
        url = `https://${hash}`;
    }

    return url;
};
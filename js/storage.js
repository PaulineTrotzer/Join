const STORAGE_TOKEN = 'Z1F4TIFX7HNAFC2XD98RU2PQZKMW7RQC4B76N7J3';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * The setItem function saves a value pair (key and value) in the remote memory by sending a POST request to the memory URL with the specified data and returning the response as JSON.
 * 
 * @param {string} key - self-selected key to define data structure
 * @param {*} value - selected data type 
 * @returns - the received data as JSON
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}


/**
 * The getItem function retrieves the value from the remote storage that corresponds to the specified key by sending a request to the storage URL with the key and token. 
 * 
 * @param {string} key - hey which is set in the setItem-function.
 * @returns - the received data as JSON.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}


/**
 * The resetRemote function clears the contents of the memory object with the specified key by setting the value array to an empty list.
 * 
 * @param {string} key - key which is set in setItem-function.
 */
async function resetRemote(key) {
    await setItem(key, []).then();
}

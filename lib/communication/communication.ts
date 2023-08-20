async function post<T>(url: string, body: T) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export { post }

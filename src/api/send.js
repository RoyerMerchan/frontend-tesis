export const send = async ({ endpoint, method = 'GET', body = null }) => {
    const url = `${import.meta.env.VITE_API_URL}/${endpoint}`;
    const options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en la solicitud');
    }

    return res.json();
};

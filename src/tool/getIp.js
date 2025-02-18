export async function getAddress() {
    const result = await fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const clientIP = data.ip;
            return "" + clientIP
        })
        .catch(error => {
            console.error('Error fetching IP:', error);
            return ""
        });

    return result
}
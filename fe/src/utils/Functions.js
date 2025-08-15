import CryptoJS from 'crypto-js';

const secretKey = "REACT_APP_SECRET_KEY";
export const encryptToken = (token) => {
    return CryptoJS.AES.encrypt(token, secretKey).toString();
};
export const decryptToken = (encryptedToken) => {
    try {
        if (!encryptedToken || typeof encryptedToken !== "string") {
            console.warn("Invalid encrypted token:", encryptedToken);
            return null;
        }
        if (!secretKey) {
            console.error("Missing secret key for decryption!");
            return null;
        }

        const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);

        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            console.warn("Decryption produced empty string, token might be invalid.");
            return null;
        }

        return decrypted;
    } catch (err) {
        console.error("Decryption error:", err);
        return null;
    }
};

export function getDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
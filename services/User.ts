import api from "./api";

export async function getUserData(id: string) {
    try {
        const result = await api.get(`/users/${id}`);
        return result.data;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}
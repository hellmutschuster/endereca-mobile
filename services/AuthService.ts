import api from "./api";

export async function performLogin(email: string, password: string) {
    if(!email || !password) return null;

    try {
        const result = await api.post("/login", {
            email,
            password
        });
        console.log(result);
        return result.data;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}
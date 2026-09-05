import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email: email,
            password: password,
            role: role
        });

        return response.data;

    } catch (error) {

        if (error.response && error.response.data) {
            throw new Error(
                error.response.data.message || "Login failed"
            );
        }

        throw new Error("Unable to connect to server");
    }
};
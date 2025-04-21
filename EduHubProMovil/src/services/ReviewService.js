import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, STORAGE_KEYS } from "../constants";

const ReviewService = {
    async createReview(score, description, courseId, instructor_id) {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        return await fetch(`${API_BASE_URL}/student/review/create`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: score,
                description: description,
                studentId: token,
                courseId: courseId,
                instructor_id: instructor_id
            })
        }).then((response) => response.json())
            .then((response) => {
                console.log("\nResponse from createReview:\n", response); // Log the response for debugging

                if (response.type !== "SUCCESS") {
                    if (typeof response === "object" && !response.text) {
                        const errorMessages = Object.values(response).join("\n");
                        return { success: false, error: errorMessages };
                    }

                    if (response.text) {
                        return { success: false, error: response.text };
                    }

                    return { success: false, error: "Ha ocurrido un error. Por favor intenta de nuevo más tarde." };
                }

                return { success: true, data: response.result };
            })
            .catch((error) => {
                return {
                    success: false,
                    error: error?.message || "Ha ocurrido un error. Por favor intenta de nuevo más tarde."
                };
            });
    }
};

export default ReviewService;

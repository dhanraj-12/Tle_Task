import { cfApiConfig } from "../cfapi";
import axios from "axios"

const cfhandleinfo = async (handle: string) => {

    try {

        const response = await axios.get(
            `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userInfo(handle)}`
        )
        return response.data.result[0];

    } catch (e) {
        console.error("Error fetching user info:", e);
        return null;
    }

}

export default cfhandleinfo;
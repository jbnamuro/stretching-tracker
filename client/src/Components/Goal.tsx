import { useEffect } from "react"
import API from "../lib/api"

const Goal = () => {

    useEffect(() => {
        const getMinsCompleted = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API}/calendar`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
            } catch (err) {
                console.error(err);
            }

        }
        getMinsCompleted()
    }, [])

    return (
        <div></div>
    )
}

export default Goal

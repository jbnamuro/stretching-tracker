import { useEffect, useState } from "react"
import API from "../lib/api"
import { Temporal } from "@js-temporal/polyfill"

const Goal = () => {

    const [timeLeft, setTime] = useState(0);

    useEffect(() => {
        const getMinsCompleted = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = '2807ef65-e5d0-49d2-9058-bc9ec2d62d13';
                const response = await fetch(`${API}/calendar?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                const data = await response.json();
                const entries = data.data.entries;
                const date = Temporal.Now.plainDateISO();
                let total = 0;

                entries.forEach((element: { completedDate: string; actualDuration?: number }) => {
                    const dateComp = element.completedDate.split('T')[0];
                    const plain = Temporal.PlainDate.from(dateComp);
                    if (date.equals(plain)) {
                        total = total + (element.actualDuration ?? 0)
                    }
                });
                // console.log(total)
                setTime(Math.floor(total / 60));
                // const sum = entries.reduce((acc: number, entry: { actualDuration?: number }) => acc + (entry.actualDuration ?? 0), 0);
                // console.log(sum);
            } catch (err) {
                console.error(err);
            }

        }
        getMinsCompleted()
    }, [])

    return (
        <div>{`${timeLeft} of 20 minutes`}</div>
    )
}

export default Goal

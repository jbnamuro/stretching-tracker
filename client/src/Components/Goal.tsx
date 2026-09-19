import { useEffect, useState } from "react"
import API from "../lib/api"
import { Temporal } from "@js-temporal/polyfill"
import Vector from "../assets/Vector.png"

const Goal = () => {

    const [timeLeft, setTime] = useState(0);

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
        <div className="mt-5 bg-surface-container-low rounded-xl px-8 py-5 drop-shadow-lg">
            <p className="text-headline-lg text-on-surface-variant font-semibold"><span className="text-on-surface">{`${timeLeft}`}</span> of 20 minutes</p>
            <p className="text-body-lg font-medium text-on-surface-variant">Completed today</p>
            <div className="mt-10 w-full h-14 px-2 flex items-center bg-surface-container-high rounded-xl">
                <div className="bg-primary flex justify-center items-center text-on-primary h-10 rounded-xl" style={{ width: `${Math.min(Math.max((timeLeft / 20) * 100, 15), 100)}%` }}>{`${(timeLeft / 20) * 100}%`}</div>
            </div>
            <div className="flex mt-8 items-center gap-2">
                <img src={Vector} alt="clock" className="h-5 w-5" />
                <p className="uppercase text-label font-semibold text-on-surface-variant">{`${Math.max(20 - timeLeft, 0)} mins remaining`}</p>
            </div>

        </div>
    )
}

export default Goal

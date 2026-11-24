import { useState, useEffect } from "react";

export function usePersistentState<T>(key: string, initial: T) {

    const [value, setValue] = useState<T>(() => {
        const saved = localStorage.getItem(key);

        try {
            const loadedState: T = (saved === null) ? initial : JSON.parse(saved);
            return loadedState
        } catch {
            return initial
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue] as const;

}
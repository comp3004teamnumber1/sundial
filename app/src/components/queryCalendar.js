import {
    getStorageKey,
    getSessionKey,
    constants,
} from './constants';
import axios from 'axios';

export async function queryHourlyWeekly() {
    const [session_key, location] = await Promise.all([
        getSessionKey(),
        getStorageKey('current_location'),
    ]);
  
    // build query
    const queryParams = {
        location: location || 'Ottawa, Ontario',
    };
    const queryString = `?${Object.entries(queryParams)
        .map(([k, v], i) => `${k}=${v}`)
        .join('&')}`;
    const config = {
        headers: {
            'Session-Key': session_key,
        },
    };
    // query data
    const [hourlyRes, weeklyRes] = await Promise.all([
        axios.get(`${constants.SERVER_URL}/hourly${queryString}`, config),
        axios.get(`${constants.SERVER_URL}/daily${queryString}`, config),
    ]);

    return await {
        hourly: hourlyRes,
        weekly: weeklyRes,
    };
}
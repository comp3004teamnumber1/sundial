import {
    getStorageKey,
    getSessionKey,
    constants,
} from './constants';
import axios from 'axios';

export async function queryHourlyWeekly() {
    const [session_key, location, units] = await Promise.all([
        getSessionKey(),
        getStorageKey('current_location'),
        getStorageKey('units')
    ]);

    // build query
    const queryParams = {
        location: location || 'Ottawa, Ontario',
        units: units
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
        units: units
    };
}
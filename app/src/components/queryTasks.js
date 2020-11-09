import {
    getStorageKey,
    getSessionKey,
    constants,
} from './constants';
import axios from 'axios';

export async function queryTasks() {
    const [username, session_key, location] = await Promise.all([
        getStorageKey('username'),
        getSessionKey(),
        getStorageKey('current_location'),
    ]);
  
    // build query
    const queryParams = {
        username,
        current: "true",
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
    const [tasksRes] = await Promise.all([
        axios.get(`${constants.SERVER_URL}/task${queryString}`, config),
    ]);

    return await {
        tasks: tasksRes.data.tasks
    };
}
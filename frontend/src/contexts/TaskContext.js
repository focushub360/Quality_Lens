import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [isPolling, setIsPolling] = useState(false);

    // Load tasks from localStorage on mount (optional persistence)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('activeAnalysisTasks');
            if (stored) {
                setTasks(JSON.parse(stored));
            }
        } catch (err) {
            console.error('Failed to load tasks from storage:', err);
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('activeAnalysisTasks', JSON.stringify(tasks));
        } catch (err) {
            console.error('Failed to save tasks to storage:', err);
        }
    }, [tasks]);

    const addTask = useCallback((task) => {
        setTasks(prev => {
            // Avoid duplicates
            if (prev.find(t => t.task_id === task.task_id)) return prev;
            return [...prev, { ...task, addedAt: new Date().toISOString() }];
        });
    }, []);

    const updateTask = useCallback((taskId, updates) => {
        setTasks(prev => prev.map(t =>
            t.task_id === taskId ? { ...t, ...updates } : t
        ));
    }, []);

    const removeTask = useCallback((taskId) => {
        setTasks(prev => prev.filter(t => t.task_id !== taskId));
    }, []);

    // Polling logic
    useEffect(() => {
        const activeTasks = tasks.filter(t => ['pending', 'processing'].includes(t.status));

        if (activeTasks.length === 0) {
            setIsPolling(false);
            return;
        }

        setIsPolling(true);
        const interval = setInterval(async () => {
            for (const task of activeTasks) {
                try {
                    // Determine endpoint based on task type (default analysis)
                    const endpoint = task.type === 'bulk'
                        ? `/bulk-status/${task.batch_id || task.task_id}`
                        : `/analyze-status/${task.task_id}`;

                    const res = await api.get(endpoint);
                    const data = res.data;

                    // Always update — don't wait just for status changes
                    updateTask(task.task_id, {
                        status: data.status,
                        message: data.message,
                        result_id: data.result_id,
                        error_message: data.error_message
                    });

                    // Safety net: if still "processing" for >5 min but has a result_id, force-complete
                    if (data.status === 'processing' && data.result_id) {
                        const addedAt = new Date(task.addedAt || Date.now());
                        const minutesElapsed = (Date.now() - addedAt.getTime()) / 60000;
                        if (minutesElapsed > 5) {
                            console.warn(`Task ${task.task_id} stuck in processing but has result_id — force completing`);
                            updateTask(task.task_id, {
                                status: 'completed',
                                result_id: data.result_id,
                                message: 'Analysis completed'
                            });
                        }
                    }
                } catch (err) {
                    console.error(`Error polling task ${task.task_id}:`, err);
                    // Mark as failed if 404
                    if (err.response?.status === 404) {
                        updateTask(task.task_id, { status: 'failed', error_message: 'Task not found' });
                    }
                }
            }
        }, 3000); // Poll every 3s for faster completion detection

        return () => clearInterval(interval);
    }, [tasks, updateTask]);

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    return useContext(TaskContext);
}

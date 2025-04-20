// CourseProgressProvider.js -----------------------------------------------
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CourseProgressContext = createContext();
export const useCourseProgress = () => useContext(CourseProgressContext);

/* ---------- Estado inicial ---------- */
const initialState = {
    sectionsByModule: {},   // { moduleId: [sectionId, …] }
    sectionEntities: {},
    moduleStatus: {},       // { moduleId: 'LOCKED' | 'UNLOCKED' | 'COMPLETED' }
    completedSections: [],
    unlockedModules: [],
    currentSection: null,
};

/* ---------- Acciones ---------- */
export const ACTIONS = {
    LOAD_COURSE_STRUCTURE: 'LOAD_COURSE_STRUCTURE',
    SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
    REFRESH_STRUCTURE: 'REFRESH_STRUCTURE',
};

/* ---------- Reducer ---------- */
const reducer = (state, action) => {
    switch (action.type) {

        /* 1. Progreso local (AsyncStorage) --------------------- */
        case ACTIONS.LOAD_PROGRESS:
            return {
                ...state,
                completedSections: action.payload.completedSections ?? state.completedSections,
                unlockedModules: action.payload.unlockedModules ?? state.unlockedModules,
            };

        /* 2. Malla de curso desde el backend ------------------- */
        case ACTIONS.LOAD_COURSE_STRUCTURE: {
            const { modules } = action.payload;

            const sectionsByModule = {};
            const sectionEntities = {};
            const moduleStatus = {};

            modules.forEach((m) => {
                moduleStatus[m.moduleId] = m.status;      // «LOCKED», «UNLOCKED», «COMPLETED»
                sectionsByModule[m.moduleId] = m.sections.map((s) => s.sectionId);

                m.sections.forEach((s) => {
                    sectionEntities[s.sectionId] = {
                        ...s,
                        moduleId: m.moduleId,
                        isLast: Boolean(s.isLast),
                    };
                });
            });

            return {
                ...state,
                sectionsByModule,    // ← nombre consistente
                sectionEntities,
                moduleStatus,
            };
        }

        /* 3. Completar sección --------------------------------- */
        case ACTIONS.COMPLETE_SECTION: {
            const { sectionId } = action.payload;
            if (state.completedSections.includes(sectionId)) return state;

            const updated = [...state.completedSections, sectionId];
            AsyncStorage.setItem('completedSections', JSON.stringify(updated));
            return { ...state, completedSections: updated };
        }

        /* 4. Desbloquear módulo -------------------------------- */
        case ACTIONS.UNLOCK_MODULE: {
            const { moduleId } = action.payload;
            if (state.unlockedModules.includes(moduleId)) return state;

            const updated = [...state.unlockedModules, moduleId];
            AsyncStorage.setItem('unlockedModules', JSON.stringify(updated));
            return { ...state, unlockedModules: updated };
        }

        /* 5. Seleccionar sección actual ------------------------ */
        case ACTIONS.SET_CURRENT_SECTION:
            return { ...state, currentSection: action.payload };

        default:
            return state;
    }
};

/* ---------- Selectores rápidos ---------- */
export const getNextSectionIdInModule = (state, sectionId) => {
    const sec = state.sectionEntities[sectionId];
    if (!sec) return null;
    const list = state.sectionsByModule[sec.moduleId] || [];
    const idx = list.indexOf(sectionId);
    return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
};

export const getPrevSectionIdInModule = (state, sectionId) => {
    const sec = state.sectionEntities[sectionId];
    if (!sec) return null;
    const list = state.sectionsByModule[sec.moduleId] || [];
    const idx = list.indexOf(sectionId);
    return idx > 0 ? list[idx - 1] : null;
};
/* ---------- Provider ---------- */
export const CourseProgressProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    /* Cargar progreso local solo (NO estructura) ------------ */
    useEffect(() => {
        (async () => {
            try {
                const [sectionsJSON, modulesJSON] = await Promise.all([
                    AsyncStorage.getItem('completedSections'),
                    AsyncStorage.getItem('unlockedModules'),
                ]);

                dispatch({
                    type: ACTIONS.LOAD_PROGRESS,
                    payload: {
                        completedSections: sectionsJSON ? JSON.parse(sectionsJSON) : [],
                        unlockedModules: modulesJSON ? JSON.parse(modulesJSON) : [],
                    },
                });
            } catch (err) {
                console.warn('Error al cargar progreso:', err);
            }
        })();
    }, []);

    return (
        <CourseProgressContext.Provider value={{ state, dispatch }}>
            {children}
        </CourseProgressContext.Provider>
    );
};

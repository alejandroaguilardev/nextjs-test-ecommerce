import { FC, ReactNode, useReducer } from 'react';
import { UIContext } from './UIContext';
import { uiReducer } from './uiReducer';


interface Props {
    children: ReactNode;
}

export interface UIState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false
};

export const UIProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(uiReducer,
        UI_INITIAL_STATE);


    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' })
    }

    return (
        <UIContext.Provider value={{ ...state, toggleSideMenu }}>{children}</UIContext.Provider>
    );
};
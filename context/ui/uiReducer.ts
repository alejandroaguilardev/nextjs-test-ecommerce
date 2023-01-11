import { UIState } from "./";

type UIActionType = {  type: "[UI] - ToggleMenu" };

export const uiReducer = (state: UIState, action: UIActionType) => {
	switch (action.type) {
		case "[UI] - ToggleMenu":
			return {
				...state,
				isMenuOpen: !state.isMenuOpen,
			};
		default:
			return {
				...state,
			};
	}
};

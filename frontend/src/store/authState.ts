import {create} from 'zustand'

export type Auth = {

    username: string,
    user_id: number,
    avatar: string

}

export interface AuthState {
    auth: Auth | null
    setAuth: (payload: Auth) => void
}

const useAuthState = create<AuthState>(set => ({
    auth: null,
    setAuth: (payload) => set({
        auth: payload
    })
}))

export default useAuthState
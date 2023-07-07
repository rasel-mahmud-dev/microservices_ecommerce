import {create} from 'zustand'

export type Auth = {

    username: string,
    user_id: number,
    avatar: string

}

interface AuthState {
    auth: Auth | null
}

const useAuthState = create<AuthState>(set => ({
    auth: null,
    setAuth: (payload: Auth) => set({
        auth: payload
    })
}))

export default useAuthState
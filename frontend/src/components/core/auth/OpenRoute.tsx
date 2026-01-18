

import { useAuthStore } from '@/stores/authStore';
import React from 'react'
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps{
    children:React.ReactNode
}

function OpenRoute({children}:PrivateRouteProps) {
    const { token } = useAuthStore();
     if(token === null)
        return children
     else
        return <Navigate to="/" />
}

export default OpenRoute
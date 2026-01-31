// src/app/(auth)/signup/hospital/page.tsx
'use client'
import AuthForm from '@/components/auth/AuthForm'
import React from 'react'

const HospitalSignupPage = () => {
  return (
    <div className='w-full'>
        <AuthForm type='signup' userRole='hospital' />
    </div>
  )
}

export default HospitalSignupPage
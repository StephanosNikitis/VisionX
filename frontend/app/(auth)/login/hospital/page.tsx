// src/app/(auth)/login/hospital/page.tsx
'use client'
import AuthForm from '@/components/auth/AuthForm'
import React from 'react'

const HospitalLoginPage = () => {
  return (
    <div className='w-full'>
        <AuthForm type='login' userRole='hospital' />
    </div>
  )
}

export default HospitalLoginPage
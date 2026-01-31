// src/app/onboarding/hospital/page.tsx
'use client'
import HospitalOnboardingForm from '@/components/hospital/HospitalOnboardingForm'
import React from 'react'

const HospitalOnboardingPage = () => {
  return (
    <div className='container mx-auto py-10'>
        <HospitalOnboardingForm />
    </div>
  )
}

export default HospitalOnboardingPage
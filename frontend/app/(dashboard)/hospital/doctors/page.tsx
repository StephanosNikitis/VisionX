// src/app/(dashboard)/hospital/doctors/page.tsx
'use client'
import React, { useEffect } from 'react'
import { useHospitalStore } from '@/store/hospitalStore';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';

const HospitalDoctorsPage = () => {
    const { doctors, fetchDoctors, removeDoctor, loading } = useHospitalStore();

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    if (loading) {
        return <div>Loading...</div>
    }

  return (
    <>
    <Header showDashboardNav={true} />
    <div className='container mx-auto py-20'>
        <h1 className='text-2xl font-bold mb-6'>Manage Doctors</h1>
        <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead>
                        <tr>
                            <th className='py-2'>Name</th>
                            <th className='py-2'>Specialization</th>
                            <th className='py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td className='py-2'>{doctor.name}</td>
                                <td className='py-2'>{doctor.specialization}</td>
                                <td className='py-2'>
                                    <Button
                                        variant='destructive'
                                        size='sm'
                                        onClick={() => removeDoctor(doctor._id)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}

export default HospitalDoctorsPage
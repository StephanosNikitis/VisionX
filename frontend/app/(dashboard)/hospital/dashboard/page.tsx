// src/app/(dashboard)/hospital/dashboard/page.tsx
'use client'
import { userAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHospitalStore } from '@/store/hospitalStore';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';

const HospitalDashboardPage = () => {
    const { user, fetchProfile, loading: userLoading } = userAuthStore();
    const { doctors, fetchDoctors, removeDoctor, loading: doctorsLoading } = useHospitalStore();

    useEffect(() => {
        fetchProfile();
        fetchDoctors();
    }, [fetchProfile, fetchDoctors]);

    if (userLoading || doctorsLoading) {
        return <div>Loading...</div>
    }

  return (
    <>
    <Header showDashboardNav={true} />
    <div className='container mx-auto py-20'>
      <div className='flex items-center space-x-4 mb-6'>
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profileImage} alt={user?.hospitalName} />
          <AvatarFallback>{user?.hospitalName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className='text-2xl font-bold'>{user?.hospitalName}</h1>
      </div>
      {user && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Hospital Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <p className='text-gray-500'>Email</p>
                    <p>{user.email}</p>
                </div>
                <div>
                    <p className='text-gray-500'>Phone</p>
                    <p>{user.phone}</p>
                </div>
                <div>
                    <p className='text-gray-500'>City</p>
                    <p>{user.city}</p>
                </div>
                <div>
                    <p className='text-gray-500'>Address</p>
                    <p>{user.address}</p>
                </div>
                <div>
                    <p className='text-gray-500'>Total Beds</p>
                    <p>{user.totalBeds}</p>
                </div>
                <div>
                    <p className='text-gray-500'>ICU Beds</p>
                    <p>{user.icuBeds}</p>
                </div>
                <div>
                    <p className='text-gray-500'>Emergency Beds</p>
                    <p>{user.emergencyBeds}</p>
                </div>
            </div>
        </div>
      )}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4'>Doctors</h2>
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

export default HospitalDashboardPage
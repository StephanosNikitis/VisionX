// src/components/auth/AuthForm.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { userAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'signup';
  userRole: 'doctor' | 'patient' | 'hospital';
}

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

 const AuthForm = ({ type, userRole }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hospitalName: '',
    phone: '',
    city: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { 
    registerPatient, 
    registerDoctor,
    registerHospital, 
    loginPatient, 
    loginDoctor,
    loginHospital, 
    loading, 
    error ,
  } = userAuthStore();

  const router = useRouter();


  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signup' && !agreeToTerms) return;

    try {
      if (type === 'signup') {
        if (userRole === 'doctor') {
          await registerDoctor({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } else if (userRole === 'patient') {
          await registerPatient({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } else if (userRole === 'hospital') {
          await registerHospital({
            hospitalName: formData.hospitalName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
          });
        }
        router.push(`/onboarding/${userRole}`);
      } else {
        if (userRole === 'doctor') {
          await loginDoctor(formData.email, formData.password);
          router.push('/doctor/dashboard');
        } else if (userRole === 'patient') {
          await loginPatient(formData.email, formData.password);
          router.push('/patient/dashboard');
        } else if (userRole === 'hospital') {
          await loginHospital(formData.email, formData.password);
          router.push('/hospital/dashboard');
        }
      }
    } catch (err) {
        console.log(err)
      console.error(`${type} failed:`, err);
    }
  };

  const isSignup = type === 'signup';
  const title = isSignup ? 'Create a secure account' : 'Welcome back';
  const buttonText = isSignup ? 'Create account' : 'Sign in';
  const altLinkText = isSignup ? 'Already a member?' : "Don't have an account?";
  const altLinkAction = isSignup ? 'Sign in' : 'Sign up';
  const altLinkPath = isSignup ? `/login/${userRole}` : `/signup/${userRole}`;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">MediCare+</h1>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field for signup */}
            {isSignup && userRole !== 'hospital' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                  required
                />
              </div>
            )}

            {isSignup && userRole === 'hospital' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                    required
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Terms checkbox for signup */}
            {isSignup && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                  I confirm that I am over 18 years old and agree to MediCare+'s{' '}
                  <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and{' '}
                  <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3"
              disabled={loading || (isSignup && !agreeToTerms)}
            >
              {loading ? `${type === 'signup' ? 'Creating' : 'Signing'} in...` : buttonText}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">{altLinkText} </span>
            <Link 
              href={altLinkPath}
              className="text-blue-600 hover:underline font-medium"
            >
              {altLinkAction}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
"use client";
import { HospitalFormData } from "@/lib/types";
import { userAuthStore } from "@/store/authStore";
import { ChangeEvent, useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const HospitalOnboardingForm = () => {
  const { user, updateProfile, loading } = userAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState<HospitalFormData>({
    hospitalName: "",
    phone: "",
    city: "",
    address: "",
    totalBeds: 0,
    icuBeds: 0,
    emergencyBeds: 0,
    profileImage: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        hospitalName: user.hospitalName || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        totalBeds: user.totalBeds || 0,
        icuBeds: user.icuBeds || 0,
        emergencyBeds: user.emergencyBeds || 0,
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateProfile(formData);
      router.push("/hospital/dashboard");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-4">
            Hospital Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                type="text"
                value={formData.hospitalName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input
                id="profileImage"
                name="profileImage"
                type="text"
                value={formData.profileImage}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="totalBeds">Total Beds</Label>
                    <Input
                        id="totalBeds"
                        name="totalBeds"
                        type="number"
                        value={formData.totalBeds}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="icuBeds">ICU Beds</Label>
                    <Input
                        id="icuBeds"
                        name="icuBeds"
                        type="number"
                        value={formData.icuBeds}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="emergencyBeds">Emergency Beds</Label>
                    <Input
                        id="emergencyBeds"
                        name="emergencyBeds"
                        type="number"
        
                value={formData.emergencyBeds}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end pt-8">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Completing Setup..." : "Complete Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalOnboardingForm;
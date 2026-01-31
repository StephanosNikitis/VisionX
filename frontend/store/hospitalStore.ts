import { Doctor } from "@/lib/types";
import { getWithAuth, putWithAuth } from "@/service/httpService";
import { create } from "zustand";

interface HospitalState {
    doctors: Doctor[];
    loading: boolean;
    error: string | null;
    fetchDoctors: () => Promise<void>;
    removeDoctor: (doctorId: string) => Promise<void>;
}

export const useHospitalStore = create<HospitalState>((set, get) => ({
    doctors: [],
    loading: false,
    error: null,
    fetchDoctors: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getWithAuth("/hospital/doctors");
            set({ doctors: response.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    removeDoctor: async (doctorId: string) => {
        set({ loading: true, error: null });
        try {
            await putWithAuth(`/hospital/doctors/${doctorId}/remove`, {});
            set((state) => ({
                doctors: state.doctors.filter((doctor) => doctor._id !== doctorId),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
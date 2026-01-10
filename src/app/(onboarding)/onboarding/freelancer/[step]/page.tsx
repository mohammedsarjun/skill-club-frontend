"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFreelancerData } from "@/store/slices/freelancerSlice";
import { RootState } from "@/store/index";

import { useParams, useRouter } from "next/navigation";
import Step1Form from "@/components/onboarding/Step1Form";
import Step2Form from "@/components/onboarding/Step2Form";
import Step3Form from "@/components/onboarding/Step3Form";
import Step4Form from "@/components/onboarding/Step4Form";
import Step5Form from "@/components/onboarding/Step5Form";
import Step6Form from "@/components/onboarding/Step6Form";
import Step7Form from "@/components/onboarding/Step7Form";
import Step8Form from "@/components/onboarding/Step8Form";
import Step9Form from "@/components/onboarding/Step9Form";
import Step10Form from "@/components/onboarding/Step10Form";
import Step11Form from "@/components/onboarding/Step11Form";
import { userApi } from "@/api/userApi";
import toast from "react-hot-toast";
import { setUser } from "@/store/slices/authSlice";

const stepComponents: Record<string, any> = {
  "0": Step1Form,
  "1": Step2Form,
  "2": Step3Form,
  "3": Step4Form,
  "4": Step5Form,
  "5": Step6Form,
  "6": Step7Form,
  "7": Step8Form,
  "8": Step9Form,
  "9": Step10Form,
  "10": Step11Form
};

export default function OnboardingStepPage() {
  const { step } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();


  const user = useSelector((state: RootState) => state.auth.user);



  const freelancerData = useSelector((state: RootState) => state.freelancer);

  const StepComponent = stepComponents[step as string];
  if (!StepComponent) return <p>Invalid step</p>;

  // --- Step Guard ---
  useEffect(() => {
    const currentStep = Number(step);
    const maxAllowedStep = freelancerData.completedSteps! + 1;

    if (currentStep > maxAllowedStep) {
      // redirect to next incomplete step
      router.replace(`/onboarding/freelancer/${maxAllowedStep}`);
    }
  }, [step, freelancerData.completedSteps, router]);

  const handleSubmit = async () => {
    console.log(freelancerData)
    const response = await userApi.createFreelancerProfile(freelancerData)

    if (response.success) {
      const roleSelectionResponse = await userApi.roleSelection("freelancer")
      
      if (roleSelectionResponse.success && roleSelectionResponse.data) {
        // Update Redux
        dispatch(setUser(roleSelectionResponse.data))
        
        // Update localStorage to persist the onboarding status
        localStorage.setItem("user", JSON.stringify(roleSelectionResponse.data));
        
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          router.push("/freelancer/profile");
        }, 100);
      } else {
        toast.error(roleSelectionResponse.message || "Failed to complete onboarding");
      }
    } else {
      toast.error(response.message)
    }
  }

  const handleNext = (stepData: any) => {
    // save current step data and mark this step as completed
    dispatch(updateFreelancerData({ ...stepData, step: Number(step) }));

    // go to next step
    const nextStep = Number(step) + 1;
    router.push(`/onboarding/freelancer/${nextStep}`);
  };

  const handleBack = () => {
    const prevStep = Number(step) - 1;
    if (prevStep >= 0) router.push(`/onboarding/freelancer/${prevStep}`);
  };

  return <StepComponent onSubmit={handleSubmit} onNext={handleNext} onBack={handleBack} savedData={freelancerData} />;
}

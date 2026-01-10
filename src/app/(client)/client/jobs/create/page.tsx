"use client";
import { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import DynamicFormModal from "@/components/common/Form";
import JobFormStep1 from "@/components/client/job-form/JobFormStep1";
import JobFormStep2 from "@/components/client/job-form/JobFormStep2";
import JobFormStep3 from "@/components/client/job-form/JobFormStep3";
import JobFormStep4 from "@/components/client/job-form/JobFormStep4";
import { JobData } from "@/types/interfaces/IClient";
import toast from "react-hot-toast";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { useRouter } from "next/navigation";

function CreateJobPost() {
  const [step, setStep] = useState<number>(1);
  const [isNextAllowed, setIsNextAllowed] = useState<boolean>(false);
  const totalSteps = 4;
  const [jobSavedData, setJobSavedData] = useState<JobData>();
  const nextContent = step == totalSteps ? "Submit" : "Next";
  const route = useRouter();
  // Map of step number to component
  const stepComponents: Record<number, any> = {
    1: JobFormStep1,
    2: JobFormStep2, // Add more steps here
    3: JobFormStep3,
    4: JobFormStep4,
  };

  const CurrentStepComponent = stepComponents[step]; // get the current step component

  async function handleClickNext() {
    if (jobSavedData) {
      sessionStorage.setItem("jobSavedData", JSON.stringify(jobSavedData));
    }
    if (step != totalSteps) {
      setStep(step + 1);
    } else {
      const jobData = sessionStorage.getItem("jobSavedData");

      if (!jobData) {
        return toast.error("Something Went Wrong Fill Job Detail Again!");
      }
      const parsedJobData: JobData = JSON.parse(jobData);

      if (parsedJobData.rateType == "hourly") {
        delete parsedJobData.fixedRate;
      } else {
        delete parsedJobData.hourlyRate;
      }

      const jobCreateResponse = await clientActionApi.createJob(parsedJobData);

      if (jobCreateResponse.success) {
        toast.success(jobCreateResponse.message);
        sessionStorage.removeItem("jobSavedData");
        route.push("/client/");
      } else {
        toast.error(jobCreateResponse?.message);
        return;
      }
    }
  }

  return (
    <div>
      {CurrentStepComponent && (
        <CurrentStepComponent
          step={step}
          totalSteps={totalSteps}
          setIsNextAllowed={setIsNextAllowed}
          setJobSavedData={setJobSavedData}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
        <Button
          content="Back"
          type="button"
          variant="secondary"
          onClick={() => step > 1 && setStep(step - 1)}
        />
        {isNextAllowed ? (
          <Button
            content={nextContent}
            type="button"
            onClick={handleClickNext}
          />
        ) : (
          <Button content={nextContent} type="button" variant="secondary" />
        )}
      </div>
    </div>
  );
}

export default CreateJobPost;

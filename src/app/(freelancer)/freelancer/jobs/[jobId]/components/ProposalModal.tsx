import React, { useEffect, useState } from "react";
import { z } from "zod";
import DynamicFormModal from "@/components/common/Form";
import { Field } from "@/types/interfaces/forms";
import { proposalSchema } from "@/utils/validations/freelancerValidation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ProposalFormModalProps {
  jobType: "hourly" | "fixed";
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
}

const ProposalFormModal: React.FC<ProposalFormModalProps> = ({
  jobType,
  onSubmit,
  onClose,
}) => {
  // ✅ Fields based on job type
  const hourlyFields: Field[] = [
    {
      name: "hourlyRate",
      label: `Your Hourly Rate (₹)`,
      type: "number",
      placeholder: "Enter your hourly rate",
      group: "payment",
    },
    {
      name: "availableHoursPerWeek",
      label: "Available Hours per Week",
      type: "number",
      placeholder: "e.g., 20",
      group: "payment",
    },
    {
      name: "coverLetter",
      label: "Cover Letter",
      type: "textarea",
      placeholder: "Write your proposal...",
      group: "info",
    },
  ];

  const fixedFields: Field[] = [
    {
      name: "proposedBudget",
      label: `Proposed Budget (₹)`,
      type: "number",
      placeholder: "Enter total project amount",
      group: "payment",
    },
    {
      name: "deadline",
      label: "Estimated Completion Date",
      type: "date",
      group: "payment",
    },
    {
      name: "coverLetter",
      label: "Cover Letter",
      type: "textarea",
      placeholder: "Write your proposal...",
      group: "info",
    },
  ];

  const fields = jobType === "hourly" ? hourlyFields : fixedFields;



  return (
    <DynamicFormModal
      fields={fields}
      title="Submit Proposal"
      onSubmit={onSubmit}
      onClose={onClose}
      validationSchema={proposalSchema(jobType)}
      mode="create"
      layout="vertical"
      submitContent="Submit"
    />
  );
};

export default ProposalFormModal;

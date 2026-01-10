"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import DynamicFormModal from "@/components/common/Form";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { jobTitleSchema } from "@/utils/validations/clientValidations";
import { tooLongInputError } from "@/utils/validations/commonValidation";
import { JobData } from "@/types/interfaces/IClient";
import DivSpinner from "@/components/common/DivSpinner";

interface JobCreationStep1Props {
  step: string;
  totalSteps: string;
  setIsNextAllowed: (value: boolean) => void;
  setJobSavedData: React.Dispatch<React.SetStateAction<JobData>>;
}

function JobFormStep1(data: JobCreationStep1Props) {
  const [categories, setCategories] = useState<
    { categoryId: string; categoryName: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    categoryId: string;
    categoryName: string;
  }>();
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobTitleError, setJobTitleError] = useState<string>("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  // 🌀 NEW loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const categoryResponse = await clientActionApi.getAllCategories();
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const jobTitleValidationResult = jobTitleSchema.safeParse(jobTitle);
    const isJobTitleTooLong = tooLongInputError("Job Title", jobTitle);
    setJobTitleError(
      isJobTitleTooLong.success ? "" : isJobTitleTooLong.errorMessage!
    );
    if (jobTitleValidationResult.success && selectedCategory) {
      data.setJobSavedData((prev) => ({
        ...prev,
        title: jobTitle,
        category: selectedCategory.categoryId,
      }));
      data.setIsNextAllowed(true);
    } else {
      data.setIsNextAllowed(false);
    }
  }, [jobTitle, selectedCategory, data.setIsNextAllowed]);

  useEffect(() => {
    const savedData = sessionStorage.getItem("jobSavedData");
    if (!savedData) return;

    const parsedSavedData: JobData = JSON.parse(savedData);

    if (parsedSavedData.title) {
      setJobTitle(parsedSavedData.title);
    }

    if (parsedSavedData.category && categories.length > 0) {
      const savedCategoryDetail = categories.find(
        (cat) => cat.categoryId === parsedSavedData.category
      );

      if (savedCategoryDetail) {
        setSelectedCategory({
          categoryId: savedCategoryDetail.categoryId,
          categoryName: savedCategoryDetail.categoryName,
        });
      }
    }
  }, [categories]);

  // 🌀 Show spinner while loading
  if (isLoading) {
    return (
      <div className="relative min-h-[300px] flex items-center justify-center">
        <DivSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Left Side */}
        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-gray-500">{`${data.step}/${data.totalSteps}`}</p>

          {/* Headline */}
          <h2 className="text-4xl">Let's start with a strong title.</h2>
          <p className="text-md text-gray-600">
            This helps your job post stand out to the right candidates. It’s the
            first thing they’ll see, so make it count!
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 space-y-6 mt-6 md:mt-0">
          <p>Write a title for your job post</p>
          <Input
            type="text"
            placeholder="Enter Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            error={jobTitleError}
          />

          {/* Example Titles */}
          <div className="mt-4">
            <p className="text-gray-500 text-sm font-medium">Example titles</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-3 mt-2">
              <li>
                Build responsive WordPress site with booking/payment
                functionality
              </li>
              <li>
                Graphic designer needed to design ad creative for multiple
                campaigns
              </li>
              <li>Facebook ad specialist needed for product launch</li>
            </ul>
          </div>

          {/* Job Category */}
          <div className="mt-6">
            <b>Job Category</b>
            <div className="mt-2 space-y-2">
              {categories.slice(0, 3).map((category) => (
                <label
                  key={category.categoryId}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="jobCategory"
                    value={category.categoryId}
                    className="accent-green-500"
                    checked={
                      selectedCategory?.categoryId === category.categoryId
                    }
                    onChange={() =>
                      setSelectedCategory({
                        categoryId: category.categoryId,
                        categoryName: category.categoryName,
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {category.categoryName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <p
            style={{ color: "#108A00" }}
            className="cursor-pointer"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            See All Categories
          </p>

          {/* Selected Summary */}
          {selectedCategory && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected:
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Selected Speciality:</span>{" "}
                {selectedCategory.categoryName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <DynamicFormModal
          title={"Select Category"}
          fields={[
            {
              name: "category",
              type: "radio",
              options: categories.map((category) => ({
                label: category.categoryName,
                value: category.categoryId,
              })),
              label: "Category",
            },
          ]}
          onSubmit={(data) => {
            const selectedCategoryName = categories.find(
              (cat) => cat.categoryId === data.category
            )?.categoryName;
            setSelectedCategory({
              categoryId: data.category,
              categoryName: selectedCategoryName || "",
            });
          }}
          onClose={() => setIsCategoryModalOpen(false)}
          mode="update"
          layout={"vertical"}
        />
      )}
    </>
  );
}

export default JobFormStep1;

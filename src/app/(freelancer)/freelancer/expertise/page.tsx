"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySelector } from "./components/CategorySelector";
import { SpecialitySelector } from "./components/SpecialitySelector";
import { SkillSelector } from "./components/SkillSelector";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { ICategory, ISpecialityWithSkills, ISkill } from "@/types/interfaces/IExpertise";
import Swal from "sweetalert2";

export default function ExpertisePage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [specialities, setSpecialities] = useState<ISpecialityWithSkills[]>([]);
	const [availableSkills, setAvailableSkills] = useState<ISkill[]>([]);
	
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			fetchSpecialities(selectedCategory);
			setSelectedSpecialities([]);
			setSelectedSkills([]);
			setAvailableSkills([]);
		}
	}, [selectedCategory]);

	useEffect(() => {
		if (selectedSpecialities.length > 0) {
			const skills = specialities
				.filter((spec) => selectedSpecialities.includes(spec._id))
				.flatMap((spec) => spec.skills);
			
			const uniqueSkills = skills.filter(
				(skill, index, self) => index === self.findIndex((s) => s._id === skill._id)
			);
			
			setAvailableSkills(uniqueSkills);
			setSelectedSkills((prev) => prev.filter((skillId) => uniqueSkills.some((s) => s._id === skillId)));
		} else {
			setAvailableSkills([]);
			setSelectedSkills([]);
		}
	}, [selectedSpecialities, specialities]);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const response = await freelancerActionApi.getAllCategories();
			if (response?.success && response.data) {
				// Accept either normalized {_id,name} or backend DTO {categoryId,categoryName}
				const mapped = response.data.map((c: any) => {
					if (c._id && c.name) return { _id: c._id, name: c.name };
					return { _id: c.categoryId ?? c.id ?? `${c.name ?? 'cat'}-${Math.random()}`, name: c.categoryName ?? c.name };
				});
				setCategories(mapped);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: response?.message || "Failed to fetch categories",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "An unexpected error occurred",
			});
		} finally {
			setLoading(false);
		}
	};

	const fetchSpecialities = async (categoryId: string) => {
		try {
			const response = await freelancerActionApi.getSpecialitiesWithSkills(categoryId);
			if (response?.success && response.data) {
				// Accept either normalized {_id,name,skills:[{_id,name}]} or backend DTO {specialityId,specialityName,skills:[{skillId,skillName}]}
				const mapped = response.data.map((s: any) => {
					if (s._id && s.name) {
						return { _id: s._id, name: s.name, skills: (s.skills || []).map((sk: any) => ({ _id: sk._id ?? sk.skillId, name: sk.name ?? sk.skillName })) };
					}
					return {
						_id: s.specialityId ?? s.id ?? `${s.specialityName ?? s.name}-${Math.random()}`,
						name: s.specialityName ?? s.name,
						skills: (s.skills || []).map((sk: any) => ({ _id: sk.skillId ?? sk._id ?? sk.id ?? `${sk.skillName ?? sk.name}-${Math.random()}`, name: sk.skillName ?? sk.name })),
					};
				});
				setSpecialities(mapped);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: response?.message || "Failed to fetch specialities",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "An unexpected error occurred",
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedCategory) {
			Swal.fire({
				icon: "warning",
				title: "Category Required",
				text: "Please select a category",
			});
			return;
		}

		if (selectedSpecialities.length === 0) {
			Swal.fire({
				icon: "warning",
				title: "Specialities Required",
				text: "Please select at least 1 speciality",
			});
			return;
		}

		if (selectedSkills.length === 0) {
			Swal.fire({
				icon: "warning",
				title: "Skills Required",
				text: "Please select at least 1 skill",
			});
			return;
		}

		setSubmitting(true);
		try {
			const response = await freelancerActionApi.updateExpertise({
				category: selectedCategory,
				specialities: selectedSpecialities,
				skills: selectedSkills,
			});

			if (response?.success) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Expertise updated successfully",
					showConfirmButton: false,
					timer: 1500,
				});
				router.push("/freelancer/profile");
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: response?.message || "Failed to update expertise",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "An unexpected error occurred",
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-gray-600">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-5xl mx-auto px-6">
				<div className="bg-white rounded-xl shadow-sm p-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">Update Your Expertise</h1>
						<p className="text-gray-600 mt-2">
							Select your category, specialities, and skills to showcase your expertise
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-8">
						<CategorySelector
							categories={categories}
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
						/>

						{selectedCategory && specialities.length > 0 && (
							<SpecialitySelector
								specialities={specialities}
								selectedSpecialities={selectedSpecialities}
								onSpecialitiesChange={setSelectedSpecialities}
							/>
						)}

						{selectedSpecialities.length > 0 && availableSkills.length > 0 && (
							<SkillSelector
								skills={availableSkills}
								selectedSkills={selectedSkills}
								onSkillsChange={setSelectedSkills}
							/>
						)}

						<div className="flex gap-4 pt-6 border-t">
							<button
								type="button"
								onClick={() => router.push("/freelancer/profile")}
								className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting || !selectedCategory || selectedSpecialities.length === 0 || selectedSkills.length === 0}
								className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
							>
								{submitting ? "Saving..." : "Save Expertise"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

"use client";
import { ISpecialityWithSkills } from "@/types/interfaces/IExpertise";

interface Props {
	specialities: ISpecialityWithSkills[];
	selectedSpecialities: string[];
	onSpecialitiesChange: (specialityIds: string[]) => void;
}

export function SpecialitySelector({ specialities, selectedSpecialities, onSpecialitiesChange }: Props) {
	const handleToggle = (specialityId: string) => {
		if (selectedSpecialities.includes(specialityId)) {
			onSpecialitiesChange(selectedSpecialities.filter((id) => id !== specialityId));
		} else {
			if (selectedSpecialities.length >= 3) {
				return;
			}
			onSpecialitiesChange([...selectedSpecialities, specialityId]);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<label className="block text-sm font-medium text-gray-700">
					Select Specialities (Max 3) <span className="text-red-500">*</span>
				</label>
				<span className="text-sm text-gray-500">
					{selectedSpecialities.length} / 3 selected
				</span>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{specialities.map((speciality, idx) => {
					const id = speciality._id ?? `${speciality.name}-${idx}`;
					const isSelected = selectedSpecialities.includes(speciality._id);
					const isDisabled = !isSelected && selectedSpecialities.length >= 3;
					
					return (
						<button
							key={id}
							type="button"
							onClick={() => handleToggle(id)}
							disabled={isDisabled}
							className={`p-4 rounded-lg border-2 transition-all text-left ${
								isSelected
									? "border-green-500 bg-green-50 shadow-md"
									: isDisabled
									? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
									: "border-gray-200 hover:border-green-300 hover:bg-gray-50"
							}`}
						>
							<div className="flex items-start justify-between">
								<div className="font-medium text-gray-900">{speciality.name}</div>
								{isSelected && (
									<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

"use client";
import { ISkill } from "@/types/interfaces/IExpertise";

interface Props {
	skills: ISkill[];
	selectedSkills: string[];
	onSkillsChange: (skillIds: string[]) => void;
}

export function SkillSelector({ skills, selectedSkills, onSkillsChange }: Props) {
	const handleToggle = (skillId: string) => {
		if (selectedSkills.includes(skillId)) {
			onSkillsChange(selectedSkills.filter((id) => id !== skillId));
		} else {
			if (selectedSkills.length >= 15) {
				return;
			}
			onSkillsChange([...selectedSkills, skillId]);
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<label className="block text-sm font-medium text-gray-700">
					Select Skills (Max 15) <span className="text-red-500">*</span>
				</label>
				<span className="text-sm text-gray-500">
					{selectedSkills.length} / 15 selected
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{skills.map((skill, idx) => {
					const id = skill._id ?? `${skill.name}-${idx}`;
					const isSelected = selectedSkills.includes(id);
					const isDisabled = !isSelected && selectedSkills.length >= 15;
					
					return (
						<button
							key={id}
							type="button"
							onClick={() => handleToggle(id)}
							disabled={isDisabled}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
								isSelected
									? "bg-purple-500 text-white shadow-md"
									: isDisabled
									? "bg-gray-200 text-gray-400 cursor-not-allowed"
									: "bg-white text-gray-700 border border-gray-300 hover:border-purple-400 hover:bg-purple-50"
							}`}
						>
							{skill.name}
							{isSelected && (
								<span className="ml-2">✓</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

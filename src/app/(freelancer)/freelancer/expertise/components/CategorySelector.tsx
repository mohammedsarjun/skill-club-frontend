"use client";
import { useState } from "react";
import { ICategory } from "@/types/interfaces/IExpertise";

interface Props {
	categories: ICategory[];
	selectedCategory: string;
	onCategoryChange: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategory, onCategoryChange }: Props) {
	const handleSelect = (categoryId: string) => {
		onCategoryChange(categoryId);
	};

	return (
		<div className="space-y-3">
			<label className="block text-sm font-medium text-gray-700">
				Select Category <span className="text-red-500">*</span>
			</label>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{categories.map((category, idx) => {
					const id = category._id ?? `${category.name}-${idx}`;
					return (
						<button
							key={id}
							type="button"
							onClick={() => handleSelect(id)}
							className={`p-4 rounded-lg border-2 transition-all text-left ${
								selectedCategory === id
									? "border-blue-500 bg-blue-50 shadow-md"
									: "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
							}`}
						>
							<div className="font-medium text-gray-900">{category.name}</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

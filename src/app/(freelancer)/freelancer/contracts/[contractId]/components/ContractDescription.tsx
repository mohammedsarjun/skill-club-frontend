interface ContractDescriptionProps {
  description: string;
}

export const ContractDescription = ({ description }: ContractDescriptionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
    </div>
  );
};

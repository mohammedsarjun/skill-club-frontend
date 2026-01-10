import { FaFileDownload, FaExternalLinkAlt } from 'react-icons/fa';

interface ContractReferencesProps {
  referenceFiles: { fileName: string; fileUrl: string }[];
  referenceLinks: { description: string; link: string }[];
}

export const ContractReferences = ({ referenceFiles, referenceLinks }: ContractReferencesProps) => {
  const hasReferences = referenceFiles.length > 0 || referenceLinks.length > 0;
  if (!hasReferences) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Reference Materials</h2>
      <div className="space-y-6">
        {referenceFiles.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Files</h3>
            <div className="space-y-2">
              {referenceFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaFileDownload className="text-blue-600" />
                  <span className="text-sm text-gray-900 font-medium">{file.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        {referenceLinks.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Links</h3>
            <div className="space-y-2">
              {referenceLinks.map((linkItem, index) => (
                <a
                  key={index}
                  href={linkItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaExternalLinkAlt className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{linkItem.description}</p>
                    <p className="text-xs text-gray-500 truncate">{linkItem.link}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

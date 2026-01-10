import { FaFileAlt, FaLink, FaDownload } from 'react-icons/fa';

interface ReferenceFile {
  fileName: string;
  fileUrl: string;
}

interface ReferenceLink {
  description: string;
  link: string;
}

interface OfferReferencesProps {
  referenceFiles: ReferenceFile[];
  referenceLinks: ReferenceLink[];
}

export function OfferReferences({
  referenceFiles,
  referenceLinks,
}: OfferReferencesProps) {
  if (referenceFiles.length === 0 && referenceLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reference Materials</h2>

      {referenceFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Files</h3>
          <div className="space-y-2">
            {referenceFiles.map((file, idx) => (
              <a
                key={idx}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#108A00] hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-gray-400" />
                  <span className="font-medium text-gray-900">{file.fileName}</span>
                </div>
                <FaDownload className="text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {referenceLinks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Links</h3>
          <div className="space-y-2">
            {referenceLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#108A00] hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaLink className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{link.description}</p>
                    <p className="text-sm text-gray-500">{link.link}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

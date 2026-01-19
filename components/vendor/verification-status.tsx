'use client';

import { VerificationStatus as VerificationStatusEnum } from '@/types/vendor';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText } from 'lucide-react';

interface VerificationStatusProps {
  status: VerificationStatusEnum;
  documents?: Array<{
    id: string;
    type: string;
    status: string;
    rejectionReason?: string;
  }>;
  message?: string;
}

export function VerificationStatus({
  status,
  documents = [],
  message,
}: VerificationStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case VerificationStatusEnum.APPROVED:
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Verified',
          description: 'Your business has been verified and approved.',
        };
      case VerificationStatusEnum.UNDER_REVIEW:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Under Review',
          description: 'Your documents are being reviewed by our team.',
        };
      case VerificationStatusEnum.REJECTED:
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Rejected',
          description: 'Your verification was rejected. Please review and resubmit.',
        };
      case VerificationStatusEnum.SUSPENDED:
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Suspended',
          description: 'Your vendor account has been suspended.',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Pending',
          description: 'Your verification request is pending submission.',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} p-6`}
    >
      <div className="flex items-start gap-4">
        <div className={`${config.color} flex-shrink-0`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.color} mb-1`}>
            {config.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{config.description}</p>
          {message && (
            <p className="text-sm text-gray-700 mb-4 bg-white p-3 rounded border border-gray-200">
              {message}
            </p>
          )}
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Document Status:
              </p>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{doc.type}</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      doc.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          {status === VerificationStatusEnum.REJECTED && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-800 mb-2">
                Rejection Reasons:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {documents
                  .filter((doc) => doc.rejectionReason)
                  .map((doc, index) => (
                    <li key={index}>{doc.rejectionReason}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

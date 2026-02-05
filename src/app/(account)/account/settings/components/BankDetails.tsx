import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, X, Check, AlertCircle } from 'lucide-react';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { IBankDetails } from '@/types/interfaces/IBankDetails';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { userApi } from '@/api/userApi';

interface BankDetailsData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
}

interface FormData extends BankDetailsData {
  confirmAccountNumber: string;
}

interface FormErrors {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  confirmAccountNumber?: string;
  ifscCode?: string;
}

const BankDetails: React.FC = () => {
  const [bankDetails, setBankDetails] = useState<BankDetailsData | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'savings'
  });

  const validateIFSC = (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const BankSchema = z.object({
    accountHolderName: z.string().min(3),
    bankName: z.string().min(3),
    accountNumber: z.string().regex(/^\d{9,18}$/),
    confirmAccountNumber: z.string(),
    ifscCode: z.string().length(11),
    accountType: z.enum(['savings', 'current']),
  }).refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: 'Account numbers do not match',
    path: ['confirmAccountNumber'],
  });

  const validateField = (name: keyof FormData, value: string): string => {
    let error = '';

    switch (name) {
      case 'accountHolderName':
        if (!value.trim()) {
          error = 'Account holder name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters long';
        } else if (!/^[a-zA-Z\s.]+$/.test(value)) {
          error = 'Name can only contain letters, spaces, and periods';
        }
        break;

      case 'bankName':
        if (!value.trim()) {
          error = 'Bank name is required';
        } else if (value.trim().length < 3) {
          error = 'Bank name must be at least 3 characters long';
        }
        break;

      case 'accountNumber':
        if (!value.trim()) {
          error = 'Account number is required';
        } else if (!/^\d+$/.test(value)) {
          error = 'Account number must contain only digits';
        } else if (value.length < 9 || value.length > 18) {
          error = 'Account number must be between 9-18 digits';
        }
        break;

      case 'confirmAccountNumber':
        if (!value.trim()) {
          error = 'Please confirm your account number';
        } else if (value !== formData.accountNumber) {
          error = 'Account numbers do not match';
        }
        break;

      case 'ifscCode':
        if (!value.trim()) {
          error = 'IFSC code is required';
        } else if (value.length !== 11) {
          error = 'IFSC code must be exactly 11 characters';
        } else if (!validateIFSC(value.toUpperCase())) {
          error = 'Invalid IFSC format. Example: SBIN0001234';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate all fields
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== 'accountType') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ifscCode' ? value.toUpperCase() : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormData, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const parsed = BankSchema.safeParse(formData);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Please fix the errors');
      return;
    }

    if (validateForm()) {
      setBankDetails({
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.toUpperCase(),
        accountType: formData.accountType
      });
      (async () => {
        const res = await userApi.saveBankDetails({
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          accountType: formData.accountType,
        });
        if (res?.success) {
          toast.success('Bank details saved');
        } else {
          toast.error(res?.message || 'Failed to save bank details');
        }
      })();
      setShowForm(false);
      setFormData({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        accountType: 'savings'
      });
    }
  };

  useEffect(() => {
    (async () => {
      const res = await userApi.getBankDetails();
      if (res?.success && res.data) {
        const d: IBankDetails = res.data;
        setBankDetails({
          accountHolderName: d.accountHolderName,
          bankName: d.bankName,
          accountNumber: d.accountNumber,
          ifscCode: d.ifscCode,
          accountType: d.accountType,
        });
      }
    })();
  }, []);

  const handleCancel = (): void => {
    setShowForm(false);
    setFormData({
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountType: 'savings'
    });
    setErrors({});
  };

  const handleEdit = (): void => {
    if (bankDetails) {
      setFormData({
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        confirmAccountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        accountType: bankDetails.accountType
      });
      setShowForm(true);
    }
  };

  const maskAccountNumber = (accountNumber: string): string => {
    if (accountNumber.length <= 4) return accountNumber;
    return 'X'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  if (!bankDetails && !showForm) {
    return (
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No Bank Details Added
          </h2>
          <p className="text-slate-600 mb-8">
            Add your bank account details to enable withdrawals and transfers
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Bank Details
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important</p>
              <p>Ensure all details match your bank records exactly to avoid payment rejections.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="As per bank records"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.accountHolderName 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.accountHolderName && (
                <div className="flex items-start gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.accountHolderName}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g., State Bank of India"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.bankName 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.bankName && (
                <div className="flex items-start gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.bankName}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter account number"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.accountNumber 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.accountNumber && (
                <div className="flex items-start gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.accountNumber}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Account Number *
              </label>
              <input
                type="text"
                name="confirmAccountNumber"
                value={formData.confirmAccountNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Re-enter account number"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.confirmAccountNumber 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.confirmAccountNumber && (
                <div className="flex items-start gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.confirmAccountNumber}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g., SBIN0001234"
                maxLength={11}
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.ifscCode 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 outline-none transition-all uppercase`}
              />
              {errors.ifscCode && (
                <div className="flex items-start gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{errors.ifscCode}</p>
                </div>
              )}
              {!errors.ifscCode && (
                <p className="text-slate-500 text-xs mt-2">11-character code (e.g., SBIN0001234)</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'savings' }))}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.accountType === 'savings'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  Savings
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'current' }))}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.accountType === 'current'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  Current
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-5 h-5" />
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex items-center gap-3 text-white">
            <CreditCard className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Bank Account Details</h2>
              <p className="text-blue-100 text-sm">Verified account information</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Account Holder Name</p>
              <p className="text-lg font-semibold text-slate-800">{bankDetails?.accountHolderName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Bank Name</p>
              <p className="text-lg font-semibold text-slate-800">{bankDetails?.bankName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Account Number</p>
              <p className="text-lg font-mono font-semibold text-slate-800">
                {bankDetails && maskAccountNumber(bankDetails.accountNumber)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">IFSC Code</p>
              <p className="text-lg font-mono font-semibold text-slate-800">{bankDetails?.ifscCode}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Account Type</p>
              <p className="text-lg font-semibold text-slate-800 capitalize">{bankDetails?.accountType}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={handleEdit}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Edit Bank Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;

import React from 'react'
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ReusableModalProps<TFieldValues extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TFieldValues) => void;
  children: React.ReactNode;
  title: string;
  methods: UseFormReturn<TFieldValues>;
}
const ReusableModal = <TFieldValues extends FieldValues>({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
  methods,
}: ReusableModalProps<TFieldValues>) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4">
                {children}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                  >
                    Save
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReusableModal


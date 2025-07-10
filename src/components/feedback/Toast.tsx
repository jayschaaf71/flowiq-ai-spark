import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    icon: <CheckCircle className="w-4 h-4" />,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="w-4 h-4" />,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    icon: <AlertTriangle className="w-4 h-4" />,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    icon: <Info className="w-4 h-4" />,
  });
};

// Operation feedback patterns
export const showOperationFeedback = {
  loading: (message: string = "Processing...") => {
    return toast.loading(message);
  },
  
  success: (toastId: string | number, message: string) => {
    toast.success(message, { id: toastId });
  },
  
  error: (toastId: string | number, message: string) => {
    toast.error(message, { id: toastId });
  }
};

// Common operation messages
export const TOAST_MESSAGES = {
  PATIENT: {
    CREATED: "Patient created successfully",
    UPDATED: "Patient updated successfully", 
    DELETED: "Patient deleted successfully",
    ERROR: "Failed to update patient"
  },
  APPOINTMENT: {
    CREATED: "Appointment scheduled successfully",
    UPDATED: "Appointment updated successfully",
    DELETED: "Appointment cancelled successfully", 
    ERROR: "Failed to update appointment"
  },
  GENERAL: {
    SAVED: "Changes saved successfully",
    ERROR: "Something went wrong",
    LOADING: "Loading...",
    UNAUTHORIZED: "You don't have permission to perform this action"
  }
};
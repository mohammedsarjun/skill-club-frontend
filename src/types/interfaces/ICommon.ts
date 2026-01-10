interface DialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ComponentType;
  confirmColor?: string;
}
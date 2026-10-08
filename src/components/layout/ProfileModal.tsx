import React from 'react';
import { Modal } from '../ui/Modal';
import { ProfileView } from '../../pages/ProfileView';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="wide"
      className="p-0 overflow-hidden max-h-[94vh]"
      bodyClassName="p-0 overflow-y-auto max-h-[88vh]"
    >
      <div className="p-2 sm:p-5">
        <ProfileView isModal onClose={onClose} />
      </div>
    </Modal>
  );
};

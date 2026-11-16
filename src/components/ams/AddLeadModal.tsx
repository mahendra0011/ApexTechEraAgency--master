"use client";

import AddClientModal, { UnifiedContactModalProps, CLIENT_STATUS_LIST } from "./AddClientModal";
import { Lead, Client } from "../../lib/ams/types";

export { CLIENT_STATUS_LIST };

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead?: (lead: Lead) => void;
  onAddClient?: (client: Client) => void;
}

export default function AddLeadModal({
  isOpen,
  onClose,
  onAddLead,
  onAddClient,
}: AddLeadModalProps) {
  return (
    <AddClientModal
      isOpen={isOpen}
      onClose={onClose}
      onAddLead={onAddLead}
      onAddClient={onAddClient}
    />
  );
}

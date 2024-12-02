import React, { useState } from 'react';
import { useStores } from 'store';
import { ActionButton, TicketButtonGroup } from '../../../people/widgetViews/workspace/style';

import { TicketContainer, TicketHeader, TicketTextArea } from '../../../pages/tickets/style';

interface TicketEditorProps {
  ticketData: {
    uuid: string;
    feature_uuid: string;
    phase_uuid: string;
    name: string;
    sequence: number;
    dependency: string[];
    description: string;
    status: string;
    version: number;
    number: number;
  };
}

const TicketEditor = ({ ticketData }: TicketEditorProps) => {
  const [description, setDescription] = useState('');
  const { main } = useStores();

  const handleUpdate = async () => {
    const updateTicketData = {
      uuid: ticketData.uuid,
      feature_uuid: ticketData.feature_uuid,
      phase_uuid: ticketData.phase_uuid,
      name: '',
      sequence: ticketData.sequence,
      dependency: [],
      description: description,
      status: 'DRAFT',
      version: ticketData.version + 1
    };

    try {
      await main.createUpdateTicket(updateTicketData);
    } catch (error) {
      console.error('Error registering ticket:', error);
    }
  };

  const handleTicketBuilder = () => {
    console.log('Ticket Builder clicked');
  };

  return (
    <TicketContainer>
      <TicketHeader>Ticket {ticketData.number}:</TicketHeader>
      <TicketTextArea
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        placeholder="Enter ticket details..."
      />

      <TicketButtonGroup>
        <ActionButton color="primary" onClick={handleUpdate} data-testid="story-input-update-btn">
          Update
        </ActionButton>
        <ActionButton
          color="#49C998"
          onClick={handleTicketBuilder}
          data-testid="story-generate-btn"
        >
          Ticket Builder
        </ActionButton>
      </TicketButtonGroup>
    </TicketContainer>
  );
};

export default TicketEditor;

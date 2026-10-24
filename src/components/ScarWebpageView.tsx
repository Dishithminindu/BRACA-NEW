import React from 'react';
import { OwlSerengetiView } from './OwlSerengetiView';
import { Task } from '../types';

interface ScarWebpageViewProps {
  tasks: Task[];
  onOpenTaskManager: () => void;
  onDonationClick?: () => void;
  onNewTaskClick: () => void;
}

/**
 * Adapter component redirecting the old webpage view to the new
 * OWL / SERENGETI living wildlife observation experience.
 */
export const ScarWebpageView: React.FC<ScarWebpageViewProps> = ({
  tasks,
  onOpenTaskManager,
  onNewTaskClick,
}) => {
  return (
    <OwlSerengetiView
      tasks={tasks}
      onOpenFieldOps={onOpenTaskManager}
      onNewObservationTask={onNewTaskClick}
    />
  );
};

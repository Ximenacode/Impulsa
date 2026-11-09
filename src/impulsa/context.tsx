import { createContext, useContext } from 'react';
import { Command, Database } from './model';
export type Modal = { kind: 'contact' | 'opportunity' | 'followup' | 'complete' | 'contactDetail' | 'opportunityDetail' | 'followupDetail' | 'cancel' | 'reset' | 'demo' | 'alignActions'; id?: string; contactId?: string; opportunityId?: string; targetStage?: string };
export interface Workspace { db: Database; day: string; open: (m: Modal) => void; commit: (command: Command, success: string) => boolean }
export const WorkspaceContext = createContext<Workspace>(null as unknown as Workspace);
export const useWorkspace = () => useContext(WorkspaceContext);

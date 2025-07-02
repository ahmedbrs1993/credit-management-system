import React, { useEffect, useState } from 'react';
import api from './api/api';
import {
  Container,
  Header,
  SubHeader,
  ActionList,
  ActionItem,
  Input,
  Button,
  Credits,
} from './styledComponents';
import { fetchActions, postAction, Action, CreditsType } from './api/actions';

const App: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [pendingActions, setPendingActions] = useState<Action[]>([]);
  const [credits, setCredits] = useState<CreditsType>({ A: 0, B: 0, C: 0 });
  const [newAction, setNewAction] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadActions = async () => {
    try {
      const data = await fetchActions();
      setActions(data.actions);
      setPendingActions(data.pendingActions);
      setCredits(data.credits);
      setErrorMessage(null);
    } catch {
      setErrorMessage('Failed to fetch data from server.');
    }
  };

  const addAction = async () => {
    if (!['A', 'B', 'C'].includes(newAction)) {
      setErrorMessage('Please enter a valid action type (A, B, C)');
      return;
    }

    setErrorMessage(null);
    try {
      await postAction(newAction);
      setNewAction('');
      await loadActions();
    } catch {
      setErrorMessage('Failed to add action.');
    }
  };

  useEffect(() => {
    loadActions();
    const interval = setInterval(loadActions, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Header>Action Queue</Header>
      <div>
        <SubHeader>Credits:</SubHeader>
        <Credits>
          A: {credits.A}, B: {credits.B}, C: {credits.C}
        </Credits>
      </div>
      <Input
        type="text"
        value={newAction}
        onChange={(e) => setNewAction(e.target.value)}
        placeholder="Enter action type (A, B, C)"
      />
      <Button onClick={addAction}>Add Action</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}{' '}
      <div>
        <SubHeader>Queue:</SubHeader>
        <ActionList>
          {pendingActions.map((pendingAction, index) => (
            <ActionItem key={index}>
              Type: {pendingAction.type} - Used Credit: {pendingAction.credits}{' '}
              - Status: Pending
            </ActionItem>
          ))}
          {actions.map((action, index) => (
            <ActionItem key={index}>
              Type: {action.type} - Used Credit: {action.credits} - Status:
              Succeeded
            </ActionItem>
          ))}
        </ActionList>
      </div>
    </Container>
  );
};

export default App;

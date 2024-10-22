import React, { useEffect, useState } from 'react';
import api from './api';
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

interface Action {
  type: 'A' | 'B' | 'C';
  credits: number;
}

interface Credits {
  A: number;
  B: number;
  C: number;
}

const App: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [pendingActions, setPendingActions] = useState<Action[]>([]);
  const [credits, setCredits] = useState<Credits>({ A: 0, B: 0, C: 0 });
  const [newAction, setNewAction] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchActions = async () => {
    try {
      const response = await api.get('/actions');
      setActions(response.data.actions);
      setPendingActions(response.data.pendingActions);
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  const addAction = async () => {
    if (!['A', 'B', 'C'].includes(newAction)) {
      setErrorMessage('Please enter a valid action type (A, B, C)');
      return;
    }

    setErrorMessage(null);
    try {
      await api.post('/actions', { type: newAction });
      setNewAction('');
      fetchActions();
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 15000);
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

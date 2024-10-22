import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

export const Header = styled.h1`
  color: #343a40;
`;

export const SubHeader = styled.h2`
  color: #495057;
  align-items: center;
  text-align: center;
`;

export const ActionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
`;

export const ActionItem = styled.li`
  background-color: #ffffff;
  margin: 5px 0;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: black; 
  font-family: Arial, sans-serif; 
  border: 1px solid #ced4da;
  border-radius: 5px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const Credits = styled.p`
  color: #6c757d;
`;

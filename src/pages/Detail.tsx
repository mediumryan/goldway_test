import React from 'react';
import { useParams } from 'react-router-dom';
import ColumnGroupingTable from '../components/Table';
import styled from 'styled-components';

const DetailWrapper = styled.div`
  width: 100%;
  height: 80vh;
  padding: 20px;
  padding-top: 5rem;
  display: flex;
  align-items: flex-start; /* Changed from center to flex-start */
  justify-content: center;
`;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 500px;
  height: 50%;
  margin-left: 20px;
  textarea {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

export default function Detail() {
  const { title } = useParams<{ title: string }>();

  return (
    <DetailWrapper>
      <ColumnGroupingTable />
      <CommentWrapper>
        <h3>Comment</h3>
        <textarea placeholder="コメントを入力してください"></textarea>
      </CommentWrapper>
    </DetailWrapper>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import styled from 'styled-components';
import Button from '@mui/joy/Button';
import DataTable from '../components/Table';
import { ShipDetails, Item, Comment } from '../types';

// --- Styled Components ---
const DetailWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const DetailInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableAndCommentsWrapper = styled.div`
  display: flex;
`;

const CommentWrapper = styled.div`
  flex: 1;
  margin-left: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 0.875rem; // 14px
  line-height: 1.5;
  color: #333;
  overflow-y: auto;
  max-height: 400px; // Set a max height for the comment section
  min-width: 20vw; // Set min-width to 1/5 of the viewport width
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  width: 100%;
`;

// --- Main Component ---
const DetailPage = () => {
  const { date, shipId } = useParams<{ date: string; shipId: string }>();
  const [shipDetails, setShipDetails] = useState<ShipDetails | null>(null);
  const [originalItems, setOriginalItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date || !shipId) return;

    const fetchShipData = async () => {
      try {
        setLoading(true);
        const shipDocRef = doc(db, `daily_ships/${date}/ships/${shipId}`);
        const shipDocSnap = await getDoc(shipDocRef);

        if (!shipDocSnap.exists()) {
          throw new Error('Ship not found');
        }
        setShipDetails(shipDocSnap.data() as ShipDetails);

        const itemsColRef = collection(shipDocRef, 'items');
        const itemsQuerySnap = await getDocs(itemsColRef);
        const itemsData = itemsQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Item, 'id'>),
        }));
        setItems(itemsData);
        setOriginalItems(itemsData);

        const commentsColRef = collection(shipDocRef, 'comments');
        const commentsQuerySnap = await getDocs(commentsColRef);
        const commentsData = commentsQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, 'id'>),
        }));
        setComments(commentsData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching document: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipData();
  }, [date, shipId]);

  const handleItemChange = (updatedItem: Item) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleAddItem = () => {
    const newItem: Item = {
      id: `new-${Date.now()}`,
      FORWARDER: '',
      BLNO: '',
      PIC: '',
      DEST: '',
      HANDLING: '',
      OANDF: '',
      KGS: '',
      CBM: '',
      PKG: '',
      UNIT: '',
      SHIPPER: '',
      REMARK: '',
    };
    setItems([...items, newItem]);
  };

  const handleSelectionChange = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((item) => item.id));
    }
  };

  const handleDeleteSelected = () => {
    // Add selected items to the delete queue
    const newDeletions = selectedItemIds.filter((id) =>
      originalItems.some((item) => item.id === id)
    );
    setItemsToDelete([...itemsToDelete, ...newDeletions]);

    // Remove selected items from the current view
    setItems(items.filter((item) => !selectedItemIds.includes(item.id)));

    // Clear selection
    setSelectedItemIds([]);
  };

  const handleSaveChanges = async () => {
    if (!date || !shipId) return;
    const batch = writeBatch(db);

    // Deletions
    itemsToDelete.forEach((id) => {
      const itemDocRef = doc(
        db,
        `daily_ships/${date}/ships/${shipId}/items/${id}`
      );
      batch.delete(itemDocRef);
    });

    // Additions and Updates
    items.forEach((item) => {
      const { id, ...data } = item;
      const isNew = id.startsWith('new-');
      const originalItem = originalItems.find((oi) => oi.id === id);

      if (isNew) {
        const newItemRef = doc(
          collection(db, `daily_ships/${date}/ships/${shipId}/items`)
        );
        batch.set(newItemRef, data);
      } else if (JSON.stringify(item) !== JSON.stringify(originalItem)) {
        const itemDocRef = doc(
          db,
          `daily_ships/${date}/ships/${shipId}/items/${id}`
        );
        batch.update(itemDocRef, data);
      }
    });

    try {
      await batch.commit();
      // Refetch data after saving
      const shipDocRef = doc(db, `daily_ships/${date}/ships/${shipId}`);
      const itemsColRef = collection(shipDocRef, 'items');
      const itemsQuerySnap = await getDocs(itemsColRef);
      const itemsData = itemsQuerySnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, 'id'>),
      }));
      setItems(itemsData);
      setOriginalItems(itemsData);
      setItemsToDelete([]);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes: ', error);
      alert('Failed to save changes.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DetailWrapper>
      <h3>{shipId}</h3>
      <DetailInnerWrapper>
        <TableAndCommentsWrapper>
          <DataTable
            items={items}
            selectedItemIds={selectedItemIds}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
          />
          <CommentWrapper>
            <h2>備考欄</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id}>
                  <p>
                    <strong>{comment.user}:</strong> {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </CommentWrapper>
        </TableAndCommentsWrapper>
        <ButtonContainer>
          <Button onClick={handleAddItem}>Add New Item</Button>
          <Button
            color="danger"
            onClick={handleDeleteSelected}
            disabled={selectedItemIds.length === 0}
          >
            Delete Selected
          </Button>
          <Button onClick={handleSaveChanges} sx={{ ml: 'auto' }}>
            Save Changes
          </Button>
        </ButtonContainer>
      </DetailInnerWrapper>
    </DetailWrapper>
  );
};

export default DetailPage;

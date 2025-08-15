import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import DataTable from '../components/Table';
import { ShipDetails, Item, Comment } from '../types';
import { AppUser } from '../App';
import { Box, Button, FormControl, Input, Sheet, Typography } from '@mui/joy';
import AlertDialog from '../components/AlertDialog';

interface DetailPageProps {
  user: AppUser | null;
}

// --- Main Component ---
const DetailPage: React.FC<DetailPageProps> = ({ user }) => {
  const { date, shipId } = useParams<{ date: string; shipId: string }>();
  const [shipDetails, setShipDetails] = useState<ShipDetails | null>(null);
  const [originalItems, setOriginalItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [originalComments, setOriginalComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ title: '', content: '' });

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
        setOriginalItems(JSON.parse(JSON.stringify(itemsData)));

        const commentsColRef = collection(shipDocRef, 'comments');
        const commentsQuery = query(
          commentsColRef,
          orderBy('createdAt', 'asc')
        );
        const commentsQuerySnap = await getDocs(commentsQuery);
        const commentsData = commentsQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, 'id'>),
        }));
        setComments(commentsData);
        setOriginalComments(JSON.parse(JSON.stringify(commentsData)));
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

    // Add new comments
    comments.forEach((comment) => {
      if (comment.id.startsWith('new-')) {
        const newCommentRef = doc(
          collection(db, `daily_ships/${date}/ships/${shipId}/comments`)
        );
        const commentData = {
          user: comment.user,
          comment: comment.comment,
          id: newCommentRef.id, // Assign the new document ID to the id field
          createdAt: comment.createdAt,
        };
        batch.set(newCommentRef, commentData);
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
      setOriginalItems(JSON.parse(JSON.stringify(itemsData)));
      setItemsToDelete([]);

      const commentsColRef = collection(shipDocRef, 'comments');
      const commentsQuery = query(commentsColRef, orderBy('createdAt', 'asc'));
      const commentsQuerySnap = await getDocs(commentsQuery);
      const commentsData = commentsQuerySnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, 'id'>),
      }));
      setComments(commentsData);
      setOriginalComments(JSON.parse(JSON.stringify(commentsData)));

      setDialogInfo({
        title: 'Success',
        content: 'Changes saved successfully!',
      });
      setDialogOpen(true);
    } catch (error) {
      console.error('Error saving changes: ', error);
      setDialogInfo({
        title: 'Error',
        content: 'Failed to save changes.',
      });
      setDialogOpen(true);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box sx={{ p: 1.5 }}>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogInfo.title}
        content={dialogInfo.content}
      />
      {/* 선박명 */}
      <Typography level="h3">{shipId}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', mt: 2 }}>
          {/* 테이블 */}
          <DataTable
            items={items}
            shipDetails={shipDetails}
            selectedItemIds={selectedItemIds}
            onItemChange={handleItemChange}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', flex: 1, ml: 2 }}
          >
            <Typography level="h4" sx={{ alignSelf: 'center', mb: 1 }}>
              備考欄
            </Typography>
            <Sheet
              variant="outlined"
              sx={{
                flex: 1,
                p: 1.5,
                borderRadius: 'sm',
                overflowY: 'auto',
                minWidth: 200,
                minHeight: 380,
                maxHeight: 380,
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box key={comment.id} sx={{ mt: 1 }}>
                    <Typography level="body-sm">
                      <strong>{comment.user}:</strong> {comment.comment}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography level="body-sm">No comments available.</Typography>
              )}
            </Sheet>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newCommentText = e.currentTarget.comment.value;
                if (newCommentText.trim() === '') return;

                const newComment: Comment = {
                  id: `new-${Date.now()}`,
                  user: user?.company || 'Unknown User',
                  comment: newCommentText,
                  createdAt: new Date(),
                };

                setComments([...comments, newComment]);
                e.currentTarget.comment.value = '';
              }}
            >
              <FormControl sx={{ mt: 1.5 }}>
                <Input
                  name="comment"
                  placeholder="Add a comment..."
                  sx={{ mb: 1 }}
                />
                <Button type="submit" sx={{ alignSelf: 'flex-end' }}>
                  Add Comment
                </Button>
              </FormControl>
            </form>
          </Box>
        </Box>
        {(user?.role === 'admin' || user?.role === 'operator') && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              width: '96.5%',
              gap: 1,
              zIndex: 1,
            }}
          >
            <Box>
              <Button onClick={handleAddItem}>New</Button>
              <Button
                color="danger"
                onClick={handleDeleteSelected}
                disabled={selectedItemIds.length === 0}
              >
                Delete
              </Button>
            </Box>
            <Button onClick={handleSaveChanges}>Save</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DetailPage;

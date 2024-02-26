import { Card, Modal, Row } from 'antd'
import './style.css'
import Button from '../common/button'
import { collection, deleteDoc, deleteField, getDocs, query, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import ModalContext from '../../context/ModalContext';

function Cards({showExpenseModal, showIncomeModal, income, expense, currentBalance}) {
    const [user] = useAuthState(auth)
    const {fetchTrasactionData, calculateBalance} = useContext(ModalContext)
    const handleReset =  () => {
        Modal.confirm({
            title: 'Confirm Reset',
            content: 'Are you sure you want to reset?',
            async onOk() {
                try {
                    if (user) {
                        const collectionRef = collection(db, `users/${user.uid}/transactions`);
                        const q = query(collectionRef);
                        const querySnapshot = await getDocs(q);
                        
                        querySnapshot.forEach(async (doc) => {
                            console.log(doc)
                            await deleteDoc(doc.ref);
                        });
                        toast.success("Reset Completed")
                        calculateBalance()
                        fetchTrasactionData()
                        console.log('Resetting...');
                    } else {
                        toast.error('User not authenticated');
                    }
                } catch (e) {
                    toast.error(e.message);
                }
            },
            onCancel() {
                console.log('Reset Cancelled');
            },
        });
    };

  return (
    <div>
        <Row className='row'>
            <Card bordered={true} className='card'>
                <h2 className='header'>Current Balance</h2>
                <p>{`₹ `}{currentBalance}</p>
                <Button text="Reset Button" onClick={handleReset}/>
            </Card>

            <Card bordered={true} className='card'>
                <h2 className='header'>Total Income</h2>
                <p>{`₹ `}{income}</p>
                <Button text="Add Income" onClick={showIncomeModal}/>
            </Card>

            <Card bordered={true} className='card'>
                <h2 className='header'>Total Expense</h2>
                <p>{`₹ `}{expense}</p>
                <Button text="Add Expense" onClick={showExpenseModal}/>
            </Card>
        </Row>
    </div>
  )
}

export default Cards
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';

const ModalContext = createContext();

export const ModalContextProvider = ({children}) => {

  const [user, loading] = useAuthState(auth);  

  const [transactions, setTransactions] = useState([])

  const [currentBalance,setCurrentBalance] = useState(0)
  const [income,setIncome] = useState(0)
  const [expense,setExpense] = useState(0);

  const addTransaction = async (transcation,flag=false) => {
    // Check if user is available before proceeding
    if (!user) {
      toast.error("User not logged in");
      return;
    }
    try {
      if(transcation.amount === "" || transcation.amount === undefined) return
      
      const transRef = collection(db,`users/${user.uid}/transactions`)
      await addDoc(transRef,transcation)
      (!flag) && toast.success("Added")
    } catch(error) {
      (!flag) && console.log(error.message)
    }
  }

  const onFinish = (value, type) => {
    // Check if user is available before proceeding
    if (!user) {
      toast.error("User not logged in");
      return;
    }
    const newTransaction = {
      name:value.name,
      tag:value.tag,
      date:value.date.format('YYYY-MM-DD'),
      amount:parseFloat(value.amount),
      type:type
    }
    //add this to trasactions list
    const newTransactions = [...transactions, newTransaction]
    setTransactions(newTransactions)

    addTransaction(newTransaction)
  }

  // Fetch transaction data function
  const fetchTrasactionData = async () => {
    try {
      const collectionRef = collection(db,`users/${user.uid}/transactions`)
      const q = query(collectionRef)
      const querySnapShot = await getDocs(q)
      let transactionsArray = [];
      querySnapShot.forEach((doc) => {
        transactionsArray.push(doc.data())
      })
      setTransactions(transactionsArray); 
      toast.success("transactions fetched")
    } catch(error) {
      toast.error(error.message)
    }
  }

  // Calculate balance function
  const calculateBalance = () => {
    if(user) {
      let totalIncome = 0;
      let totalExpense = 0;
      console.log("BAL", transactions)
      transactions.forEach(transaction => {

        if (transaction.type === "income") {
          totalIncome += parseFloat(transaction.amount);
        } else {
          totalExpense += parseFloat(transaction.amount);
        }
      });
      setIncome(totalIncome);
      setExpense(totalExpense);
      setCurrentBalance(totalIncome - totalExpense);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchTrasactionData();
    }
  }, [user, loading]); 

  useEffect(() => {
    calculateBalance();
  }, [transactions]); 

  

  // Render children only when user data is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ModalContext.Provider
        value={{addTransaction, onFinish, transactions, fetchTrasactionData, calculateBalance, income, expense, currentBalance}}
    >
        {children}
    </ModalContext.Provider>
  )
}


export default ModalContext
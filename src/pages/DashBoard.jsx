import React, { useContext, useEffect, useState } from 'react'
import Cards from '../components/cards'
import { Modal } from 'antd'
import AddIncomeModal from '../components/modals/addIncome'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
import AddExpenseModal from '../components/modals/addExpense'
import TransactionTable from '../components/table'
import ModalContext from '../context/ModalContext.jsx'
import Charts from '../components/charts/index.jsx'
import NoTransaction from '../components/noTransaction/index.jsx'

function DashBoard() {

  const user = useAuthState(auth)
  const { onFinish, transactions, fetchTrasactionData, calculateBalance, income, expense, currentBalance} = useContext(ModalContext)
 
  const [isShowExpenseModal, setIsShowExpenseModal] = useState(false)
  const [isShowIncomeModal, setIsShowIncomeModal] = useState(false)

  console.log(income,expense,currentBalance)

  const showExpenseModal = () => {
    setIsShowExpenseModal(true)
  }

  const showIncomeModal = () => {
    setIsShowIncomeModal(true)
  }

  const handleExpenseCancel = () =>{
    setIsShowExpenseModal(false)
  }

  const handleIncomeCancel = () => {
    setIsShowIncomeModal(false)
  }


  return (
    <div>
      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        income={income}
        expense={expense}
        currentBalance={currentBalance}
      />

      <AddIncomeModal 
        open={isShowIncomeModal}
        onCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <AddExpenseModal 
        open={isShowExpenseModal}
        onCancel={handleExpenseCancel}
        onFinish={onFinish}
      />

      {transactions.length !=0 ? <Charts transactions={transactions}/> : <NoTransaction />}
      
      <TransactionTable transactions={transactions}/>
    </div>
  )
}

export default DashBoard
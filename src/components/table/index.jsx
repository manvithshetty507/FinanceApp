import { Radio, Select, Table } from 'antd'
import React, { useContext, useState } from 'react'
import './style.css'
import Button from '../common/button';
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
import ModalContext from '../../context/ModalContext';
import { AiFillEdit } from "react-icons/ai";
import EditTransaction from '../../components/modals/editTransaction'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function TransactionTable({transactions}) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('')
    const [sortKey, setSortKey] = useState('')

    const [user] = useAuthState(auth)

    const [isShowEditModal, setIsShowEditModal] = useState(false)

    const { addTransaction, fetchTrasactionData, } = useContext(ModalContext)

    const [prevValue,setPrevValue] = useState({name:'',amount:0})

    const handleEdit = (record) => {
        console.log(record)
    }

    const onOpen = (record) => {
        setIsShowEditModal(true)
        setPrevValue({
            name:record.name,
            amount:record.amount
        })
    }

    const onCancel = () => {
        setIsShowEditModal(false)
    }

    const onFinish = async (values) => {
        try {
            let newTransaction = {
                name: values.name,
                date:values.date.format('YYYY-MM-DD'),
                amount: values.amount,
                tag: values.tag,
                type: values.type
            }
    
            console.log("trans", newTransaction);
            console.log("prev", prevValue);
    
            const q = query(
                collection(db, `users/${user.uid}/transactions`),
                where('name', '==', prevValue.name),
                where('amount', '==', parseFloat(prevValue.amount))
            )
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const docRef = doc.ref;
                await updateDoc(docRef, newTransaction);
                console.log(`Transaction updated: ${doc.id}`);
            } else {
                console.log('No matching document found.');
            }

            onCancel()
            fetchTrasactionData()
        } catch (error) {
            console.error("Error updating transaction:", error)
            toast.error(error.message)
        }
    };
    
    const columns = [
        {
            title:"Name",
            dataIndex:"name",
            key:"name",
        },
        {
            title:"Amount",
            dataIndex:"amount",
            key:"amount",
        },
        {
            title:"Tag",
            dataIndex:"tag",
            key:"tag",
        },
        {
            title:"Date",
            dataIndex:"date",
            key:"date",
        },
        {
            title:"Type",
            dataIndex:"type",
            key:"type",
        },
        {
            title:"Edit",
            dataIndex:"edit",
            key: "edit",
            render: (_, record) => (
                <button onClick={() => {
                    onOpen(record) 
                    handleEdit(record)
                }}>
                    <AiFillEdit />
                </button>
            ),
        }
    ]

    let filteredTransactions = transactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(search.toLowerCase()) &&
        transaction.type.toLowerCase().includes(typeFilter.toLowerCase())
    );

    const sortedTransaction = [...filteredTransactions].sort((a,b) => {
        if(sortKey === 'date') {
            return new Date(a.date) - new Date(b.date)
        }else if(sortKey === 'amount') {
            return a.amount - b.amount
        }else {
            return 0
        }
    })

    const dataSource = sortedTransaction.map((transaction,ind) => {
        return {
            key:ind,
            ...transaction,
        }
    })

    const exportCsv = () => {
        // Format the date to a readable format
        const formattedTransactions = transactions.map(transaction => ({
            ...transaction,
            date: new Date(transaction.date).toLocaleDateString()
        }));
    
        // Convert the transactions to CSV
        const csv = unparse({
            fields:["name","tag","amount","date","type"],
            data: formattedTransactions,
        });
    
        // Create a blob and download the CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const importCsv = (e) => {
        e.preventDefault()
        try {
            parse(e.target.files[0],{
                header:true,
                complete: async function (results) {
                    console.log("res",results)
                    for(const transaction of results.data) {
                        const newTransaction = {
                            ...transaction,
                            amount:parseFloat(transaction.amount)
                        }
                        await addTransaction(transaction,true)
                    }
                    fetchTrasactionData()
                }
            })
        }catch(error) {
            toast.error(error.message)
        }
    }
    
    

  return (
    <div className='transaction__table__container '>

        <EditTransaction 
            open={isShowEditModal}
            onCancel={onCancel}
            onFinish={onFinish}
        />
        
        <div className="first__row">
            <input
                type="text"
                placeholder='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='search__input'
            />
            <Select
                className='select__value'
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
                placeholder="Filter"
                allowClear
            >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
            </Select>
        </div>

        <div className="second__row">
            <h3>My Transactions</h3>
            <div className='radios'>
                <Radio.Group
                    className='radio__input'
                    onChange={(e) => setSortKey(e.target.value)}
                    value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="amount">Sort By Amount</Radio.Button>
                    <Radio.Button value="date">Sort By Date</Radio.Button>
                </Radio.Group>
            </div>
            <div className='btns'>
                <Button text="Export csv" onClick={exportCsv}/>
                <label for='import__csv' className='btn'>Import csv</label>
                <input 
                    type='file'
                    onChange={importCsv}
                    id='import__csv'
                    accept='.csv'
                    required
                    style={{display:'none'}}
                />
            </div>
        </div>

        <Table dataSource={dataSource} columns={columns}/>

    </div>
  )
}

export default TransactionTable
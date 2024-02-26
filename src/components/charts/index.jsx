import { Line, Pie } from '@ant-design/charts';
import React from 'react';
import './style.css';

function Charts({ transactions }) {
    
    const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    let totalAmount = 0;
    const data = sortedTransactions.map((item) => {
    totalAmount += item.type === 'income' ? parseFloat(item.amount) : parseFloat(-item.amount);
    return { date: item.date, amount: totalAmount };
    });

    console.log("data",data)

    const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

    const spendingData = [
        {tag:"food",amount:0},
        {tag:"education",amount:0},
        {tag:"others",amount:0}
    ]
    console.log("ept",expenseTransactions)
    expenseTransactions && expenseTransactions.forEach(item => {
        if(item.tag === 'food') {
            spendingData[0].amount += parseFloat(item.amount)
        }
        else if(item.tag === 'education') {
            spendingData[1].amount += parseFloat(item.amount)
        }else if(item.tag === 'others'){
            spendingData[2].amount += parseFloat(item.amount)
        }
    });

    console.log(spendingData)

    const lineConfig = {
        data: data,
        xField: 'date',
        yField: 'amount',
        width: 800,
        height: 400,
        autoFit: true,
        point: {
            size: 4,
            style: {
                fill: '#1890ff',
                stroke: '#1890ff',
                lineWidth: 1,
            },
        },
        line: {
            style: {
                stroke: '#FF0000',
                lineWidth: 2,
            },
        },
    };
    

    const pieConfig = {
        data: spendingData,
        angleField: 'amount',
        colorField: 'tag',
        width: 400,
        height: 400,
        autoFit: true,
        radius: 0.8,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{percentage}',
            style: {
                fill: '#fff',
                fontSize: 14,
                textAlign: 'center',
            },
        },
    };

    return (
        <div className='charts'>
            <div className='line-chart'>
                <h3 className='chart-heading'>Your Transactions</h3>
                <div style={{backgroundColor:'#fff'}}>
                    <Line
                        {...lineConfig} 
                    />
                </div>
            </div>

            <div className='pie-chart'>
                <h3 className='chart-heading'>Your Expendings</h3>
                <div style={{backgroundColor:'#fff'}}>
                    <Pie {...pieConfig} />
                </div>
            </div>
        </div>
    );
}

export default Charts;
